import React, { Component } from 'react';

import extend from 'lodash/extend';
import { SearchkitManager,SearchkitProvider,
	 SearchBox, RefinementListFilter, Pagination,
	 HierarchicalMenuFilter, HitsStats, SortingSelector, NoHits,
	 CheckboxFilter, ResetFilters, RangeFilter,
	 NumericRefinementListFilter, ViewSwitcherHits,
	 ViewSwitcherToggle,
	 DynamicRangeFilter, Hits, HitItemProps, BoolMust,
	 RangeQuery, HierarchicalRefinementFilter,
	 InputFilter, GroupedSelectedFilters,
	 Layout, TopBar, LayoutBody, LayoutResults,
	 ActionBar, ActionBarRow, SideBar } from 'searchkit';

import * as moment from "moment";

import './index.css';
import 'katex/dist/katex.min.css';
import Latex from 'react-latex-next';


const host = "https://lf3922vot1.execute-api.eu-west-2.amazonaws.com/v00/cliosearch/arxiv_v1/";

const searchkit = new SearchkitManager(host, {
    httpHeaders:{"Content-Type":"application/json",
		 "X-Api-Key":"wXLnActJhY7r0XUDIWNXc6y6tGYUUnBU1eeU7Stu",
		 "Es-Endpoint":"search-arxlive-t2brq66muzxag44zwmrcfrlmq4.eu-west-2.es.amazonaws.com",
		}
});


const HitItem = (props)=> {
    const {bemBlocks, result} = props;
    const source = extend({}, result._source);
    const spaces = "&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp"
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
	        dangerouslySetInnerHTML={{__html:"Citations: "+source.count_citations_article+spaces+"Novelty: "+source.metric_novelty_article.toFixed(2)}}>
	    </h4>
	    {/* Affiliations */}
	    <h4 className={bemBlocks.item("terms_institutes_article")}>
	      {source.terms_institutes_article &&
	       source.terms_institutes_article
	       .map(t => <span>{t}</span>)
	       .reduce((prev, curr) => [prev, ', ', curr])}
	    </h4>
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
	fontSize: '18',
    };
    const subDivStyle = {
	lineHeight: '22px',
    };

    const bStyle = {
	color: 'blue',
    };

    return (
	<div style={divStyle}>
	  <br/>
	  <b style={bStyle}>HierarXy</b> leverages
	  <b style={bStyle}> Machine Learning </b>
	  to rank documents by <b style={bStyle}> novelty </b>
	  <br/>
	  <div style={subDivStyle}>
	    <br/>
	    It sits on a <b style={bStyle}>needle-in-a-haystack search engine </b>
	    <br/>
	    so you can perform
            <b style={bStyle}> wider searches</b> with
            <b style={bStyle}> fewer queries</b>.
	  </div>
          <br/>
          <a href="">Find out more</a>
	</div>
    );
};


class App extends Component {
    render() {
        const searchStyle = {
	    fontSize: '100',
        };
        
	return (
	    <SearchkitProvider searchkit={searchkit}>
	      <Layout>
		<TopBar>
		  <SearchBox style={searchStyle}
                             autofocus={true}
			     searchOnChange={false}
			     prefixQueryFields={["title_of_article^10",
						 "textBody_abstract_article"]}/>
	        </TopBar>
                
	        <HelloWorldComponent/>

		<LayoutBody>
		  <SideBar>
		    {/* <DateRangeFilter id="event_date" title="Date range" */}
		    {/* 		     fromDateField="date_created_article" */}
		    {/* 		     toDateField="date_created_article" */}
		    {/* 		     calendarComponent={DateRangeCalendar} */}
		    {/* 		     rangeFormatter={(v) => moment(parseInt(""+v)).format('DD/MM/YY')} */}
		    {/* /> */}
		    <RangeFilter min={1990} max={2020} field="year_of_article" id="year_of_article" title="Year of article" showHistogram={true}/>
                    <RangeFilter min={0} max={100} field="count_citations_article" id="count_citations_article" title="Citation count" showHistogram={true}/>
		    <RangeFilter min={-300} max={250} field="metric_novelty_article" id="metric_novelty_article" title="Novelty" showHistogram={true}/>
		    <CheckboxFilter id="booleanFlag_multinational_article" title="Has transnational organisation" label="Has transnational organisation" filter={BoolMust([RangeQuery("booleanFlag_multinational_article", {gt: false})])}/>
		  <HierarchicalRefinementFilter field="json_location_article" title="Author location" id="cats"/>
		  <HierarchicalRefinementFilter field="json_fieldOfStudy_article" title="Field of study" id="fos"/>
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
			  {label:"Novelty",
			   field:"metric_novelty_article", order:"desc"},
			  {label:"Search relevance",
			   field:"_score", order:"desc"},
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
