import requests
import json

URL = ("https://search-arxlive-t2brq66muzxag44zwmrcfrlmq4."
       "eu-west-2.es.amazonaws.com/arxiv_v2/_search")


def common_query(query, search_field, cutoff_frequency=0.0001):
    return {
        "common": {
            search_field: {
                "query": query,
                "cutoff_frequency": cutoff_frequency,
                "low_freq_operator": "and"
            }
        }
    }


def regular_query(query, search_field):
    return {"match": {search_field: query}}


def significant_text_query(query_json, return_field, size,
                           shard_size=5000,
                           alg='jlh',
                           agg_name='my_agg'):
    return {
        "query": query_json,
        "size": 0,
        "aggregations": {
            agg_name: {
                "sampler": {"shard_size": shard_size},
                "aggregations": {
                    "keywords": {
                        "significant_text": {
                            "size": size,
                            "field": return_field,
                            alg: {}
                        }
                    }
                }
            }
        }
    }, agg_name


def _make_query(q, search_field,
                query_type,
                **kwargs):
    query, agg_name = significant_text_query(query_type(q, search_field),
                                             **kwargs)
    r = requests.post(URL, data=json.dumps(query),
                      headers={'Content-Type': 'application/json'})
    aggs = r.json()['aggregations']
    buckets = aggs[agg_name]['keywords']['buckets']
    return {row['key']: row['score'] for row in buckets}


STOPWORDS = _make_query(q='and of but on by however or',
                        query_type=regular_query,
                        search_field='textBody_abstract_article',
                        return_field='textBody_abstract_article',
                        size=75)


def _initial_query(q, **kwargs):
    results = _make_query(q, query_type=common_query, **kwargs)
    if len(results) == 0:
        results = _make_query(q, query_type=regular_query, **kwargs)
    return results


def make_query(q, search_field, return_field, size,
               boost=2.5, min_overlap=0.5, **kwargs):
    results = _initial_query(q, search_field=search_field,
                             return_field=return_field,
                             size=size,
                             **kwargs)
    _results = _initial_query(q, search_field=return_field,
                              return_field=return_field,
                              size=size,
                              **kwargs)
    intersection = set(results).intersection(_results)
    if (len(results) > 0 and len(_results) > 0 and
        len(intersection)/len(results) < min_overlap):
        results = _results

    for k, v in _results.items():
        v = v*boost
        if k not in results or v > results[k]:
            results[k] = v

    size = size if len(results) > size else None
    results = [r for r, c in sorted(results.items(),
                                    key=lambda r: r[1],
                                    reverse=True)][:size]
    return [r for r in results
            if r.replace("'", "")[:-1] not in results  # basic plurals
            and r not in STOPWORDS
            and r not in q]
