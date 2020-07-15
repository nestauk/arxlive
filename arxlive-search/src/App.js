import React, { Component } from 'react';

import extend from 'lodash/extend';
import { SearchkitManager,SearchkitProvider,
	 SearchBox, Pagination, HitsStats,
	 SortingSelector, NoHits,
	 ResetFilters, RangeFilter,
	 ViewSwitcherToggle, Hits,
	 HierarchicalRefinementFilter,
	 GroupedSelectedFilters,
	 Layout, TopBar, LayoutBody, LayoutResults,
	 ActionBar, ActionBarRow, SideBar } from 'searchkit';

import './index.css';
import 'katex/dist/katex.min.css';
import Latex from 'react-latex-next';


const host = "https://lf3922vot1.execute-api.eu-west-2.amazonaws.com/v00/cliosearch/arxiv_v5/"
// "https://search-arxlive-t2brq66muzxag44zwmrcfrlmq4.eu-west-2.es.amazonaws.com/arxiv_v5/"       
// "https://lf3922vot1.execute-api.eu-west-2.amazonaws.com/v00/cliosearch/arxiv_v5/";

const searchkit = new SearchkitManager(host,
                                       { httpHeaders: {"Content-Type":"application/json",
						       "X-Api-Key":"wXLnActJhY7r0XUDIWNXc6y6tGYUUnBU1eeU7Stu",
						       "Es-Endpoint":"search-arxlive-t2brq66muzxag44zwmrcfrlmq4.eu-west-2.es.amazonaws.com"}
                                       }
                                      );


const HitItem = (props)=> {
    const {bemBlocks, result} = props;
    const source = extend({}, result._source);
    const spaces = "&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp"
    let novelty = "";
    if(source.metric_novelty_article){
	novelty = "Novelty: "+source.metric_novelty_article.toFixed(2);
    }

    return (
	<div className={bemBlocks.item().mix(bemBlocks.container("item"))} data-qa="hit">
	  <div className={bemBlocks.item("subitem")}>
	    {/* Title / link to arxiv article */}
	    <a href={"https://arxiv.org/abs/"+result._id}
	       target={"https://arxiv.org/abs/"+result._id}>
	      <h2 className={bemBlocks.item("name_of_group")}>
		<Latex>{source.title_of_article}</Latex>
	      </h2>
	    </a>
	    {/* Date and authors */}
	    <h4 className={bemBlocks.item("date_created_article")}
		dangerouslySetInnerHTML={{__html:source.date_created_article}}>
	    </h4>
	    <h3 className={bemBlocks.item("terms_authors_article")}>
	      {source.terms_authors_article &&
	       source.terms_authors_article
	       .map(t => <span>{t}</span>)
	       .reduce((prev, curr) => [prev, ', ', curr])}
	    </h3>
	    <h4 className={bemBlocks.item("metric_novelty_article")}
		dangerouslySetInnerHTML={{__html:"Citations: "+source.count_citations_article+spaces+novelty}}>
	    </h4>
	    {/* Affiliations */}
	    {/* <h4 className={bemBlocks.item("terms_institutes_article")}> */}
	    {/*   {source.terms_institutes_article && */}
	    {/*    source.terms_institutes_article */}
	    {/*    .map(t => <span>{t}</span>) */}
	    {/*    .reduce((prev, curr) => [prev, ', ', curr])} */}
	    {/* </h4> */}
	    {/* Abstract text */}
	    <br></br>
	    <div className={bemBlocks.item("textBody_abstract_article")}>
	      <Latex>{source.textBody_abstract_article}</Latex>
	    </div>
	  </div>
	</div>
    );
};


// function HelloWorldComponent(props) {
const HelloWorldComponent = (props)=> {
    const divStyle = {
	textAlign: 'center', // <-- the magic
	color: 'gray',
	padding: '0',
	marginTop: '20px',
	marginBottom: '-60px',
	lineHeight: '20px',
	fontSize: '18px',
    };
    const subDivStyle = {
	lineHeight: '22px',
    };

    const bStyle = {
	color: '#000',
    };

    const tinyStyle = {
	fontSize: '12px',
    };

    return (
	<div style={divStyle}>
	  <br/>
	  <div style={subDivStyle}>
	    <b style={bStyle}>arXlive Search</b> is a
	    <b style={bStyle}> contextual search engine </b> that
	    <b style={bStyle}> expansively searches </b>
	    <br/> arXiv for terms which are
	    <b style={bStyle}> contextually similar </b>
	    to your query.
	    <br/>
	    <br/>
	  </div>
	  Articles are
	  <b style={bStyle}> ranked by novelty</b> to help you
	  find <b style={bStyle}> rare gems </b> in arXiv.
	  <br/>
	  <br/>
	  <a href="https://towardsdatascience.com/big-fast-nlp-with-elasticsearch-72ffd7ef8f2e">Read about our method here.</a>
	  <p style={tinyStyle}>Apologies to mobile users.</p>
	</div>
    );
};


class App extends Component {
    render() {
	const searchStyle = {
	    fontSize: '100px',
	};

	return (
	    <SearchkitProvider searchkit={searchkit}>
	      <Layout>
		<TopBar>
		  <SearchBox style={searchStyle}
			     autofocus={true}
			     searchOnChange={false}
			     prefixQueryFields={["title_of_article",
						 "textBody_abstract_article"]}/>

	    {/* "terms_tokens_article"]}/> */}
		</TopBar>

		<HelloWorldComponent/>

		<LayoutBody>
		  <SideBar>
		    {/* <DateRangeFilter id="event_date" title="Date range" */}
		    {/*			     fromDateField="date_created_article" */}
		    {/*			     toDateField="date_created_article" */}
		    {/*			     calendarComponent={DateRangeCalendar} */}
		    {/*			     rangeFormatter={(v) => moment(parseInt(""+v)).format('DD/MM/YY')} */}
		    {/* /> */}
		    <RangeFilter min={1990} max={2020} field="year_of_article" id="year_of_article" title="Year of article" showHistogram={true}/>
		    <RangeFilter min={0} max={300} field="count_citations_article" id="count_citations_article" title="Citation count" showHistogram={true}/>
		    <RangeFilter min={0} max={300} field="metric_citations_article" id="metric_citations_article" title="Normalized citations" showHistogram={true}/>
		    <RangeFilter min={-300} max={300} field="metric_novelty_article" id="metric_novelty_article" title="Novelty" showHistogram={true}/>
		    {/* <CheckboxFilter id="booleanFlag_multinational_article" title="Has transnational organisation" label="Has transnational organisation" filter={BoolMust([RangeQuery("booleanFlag_multinational_article", {gt: false})])}/> */}
		  <HierarchicalRefinementFilter field="json_location_article" title="Author location" id="cats"/>
		  <HierarchicalRefinementFilter field="json_fieldsOfStudy_article" title="Field of study" id="fos"/>
		  <HierarchicalRefinementFilter field="json_category_article" title="arXiv category" id="cats2"/>
		</SideBar>

		<LayoutResults>
		  <ActionBar>
		    <ActionBarRow>
		      <HitsStats translations={{
			  "hitstats.results_found":"{hitCount} results found"
		      }}/>
		      <ViewSwitcherToggle/>
		      <SortingSelector options={[
			  {label:"Search relevance",
			   field:"_score", order:"desc"},
			  {label:"Citations",
			   field:"count_citations_article", order:"desc"},
			  {label:"Normalized citations",
			   field:"metric_citations_article", order:"desc"},
			  {label:"Novelty",
			   field:"metric_novelty_article", order:"desc"},
			  {label:"Latest Releases",
			   field:"date_created_article", order:"desc"},
			  {label:"Earliest Releases",
			   field:"date_created_article", order:"asc"}
		      ]}/>
		    </ActionBarRow>

		    <ActionBarRow>
		      <GroupedSelectedFilters/>
		      <ResetFilters/>
		    </ActionBarRow>

		  </ActionBar>
		  <Hits
		    hitsPerPage={12}
		    highlightFields={["title_of_article",
				      "textBody_abstract_article"]}
		    sourceFilter={["title_of_article",
				   "textBody_abstract_article",
				   "date_created_article",
				   "terms_authors_article",
				   "metric_citations_article",
				   "count_citations_article",
				   "metric_novelty_article",
				   "json_category_article",
				   "terms_institutes_article"]}
		    itemComponent={HitItem}
		    mod="sk-hits-list"
		    scrollTo="body"
		  />
		  <NoHits suggestionsField={"title_of_article"}/>
		  <Pagination showNumbers={true}/>
		</LayoutResults>

	      </LayoutBody>
	    </Layout>
	    </SearchkitProvider>
	);
    }
}

export default App;
