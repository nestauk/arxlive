import React, { Component } from 'react'

import extend from 'lodash/extend'
import { SearchkitManager,SearchkitProvider,
	 SearchBox, RefinementListFilter, Pagination,
	 HierarchicalMenuFilter, HitsStats, SortingSelector, NoHits,
	 CheckboxFilter, ResetFilters, RangeFilter,
	 NumericRefinementListFilter, ViewSwitcherHits, ViewSwitcherToggle,
	 DynamicRangeFilter, Hits, HitItemProps, BoolMust,
	 RangeQuery, HierarchicalRefinementFilter,
	 InputFilter, GroupedSelectedFilters,
	 Layout, TopBar, LayoutBody, LayoutResults,
	 ActionBar, ActionBarRow, SideBar } from 'searchkit'

import { DateRangeFilter, DateRangeCalendar } from "searchkit-datefilter"
import * as moment from "moment";

import './index.css'
import '../node_modules/searchkit-datefilter/release/theme.css'

import 'katex/dist/katex.min.css'
import Latex from 'react-latex-next'


const host = "https://lf3922vot1.execute-api.eu-west-2.amazonaws.com/v00/cliosearch/arxiv_v0/"

const searchkit = new SearchkitManager(host, {
    httpHeaders:{"Content-Type":"application/json",
                 "X-Api-Key":"wXLnActJhY7r0XUDIWNXc6y6tGYUUnBU1eeU7Stu",
                 "Es-Endpoint":"search-arxlive-t2brq66muzxag44zwmrcfrlmq4.eu-west-2.es.amazonaws.com",
                }
})


const HitItem = (props)=> {    
  const {bemBlocks, result} = props
  const source = extend({}, result._source)
  return (
	  <div className={bemBlocks.item().mix(bemBlocks.container("item"))} data-qa="hit">
	  <div className={bemBlocks.item("subitem")}>
	  <a href={"https://arxiv.org/abs/"+result._id} target={"https://arxiv.org/abs/"+result._id}><h2 className={bemBlocks.item("name_of_group")}> <Latex>{source.title_of_article}</Latex></h2></a>
	  <h4 className={bemBlocks.item("date_created_article")} dangerouslySetInnerHTML={{__html:source.date_created_article}}></h4>
	  <h3 className={bemBlocks.item("terms_authors_article")}>
	  {source.terms_authors_article &&
	   source.terms_authors_article
               .map(t => <span>{t}</span>)
               .reduce((prev, curr) => [prev, ', ', curr])}	
          </h3>
	  <h4 className={bemBlocks.item("terms_institutes_article")}>
	  {source.terms_institutes_article &&
	   source.terms_institutes_article
               .map(t => <span>{t}</span>)
               .reduce((prev, curr) => [prev, ', ', curr])}	
          </h4>	  
	  <br></br>
          <div className={bemBlocks.item("textBody_abstract_article")}>
	  <Latex>{source.textBody_abstract_article}</Latex>
          </div>
	  	  
	  </div>
	</div>	  
  )
}

class App extends Component {
  render() {
    return (
      <SearchkitProvider searchkit={searchkit}>
        <Layout>
          <TopBar>
            <SearchBox autofocus={true} searchOnChange={false} prefixQueryFields={["title_of_article^10", "textBody_abstract_article"]}/>
          </TopBar>
        <LayoutBody>

          <SideBar>
	    <DateRangeFilter id="event_date" title="Date range"
	                     fromDateField="date_created_article"
                             toDateField="date_created_article"
	                     calendarComponent={DateRangeCalendar}
                             rangeFormatter={(v) => moment(parseInt(""+v)).format('DD/MM/YY')}
            />
            <RangeFilter min={0} max={100} field="count_citations_article" id="count_citations_article" title="Citation count" showHistogram={true}/>
	    <RangeFilter min={0} max={2} field="metric_novelty_article" id="metric_novelty_article" title="Novelty" showHistogram={true}/>
	    <CheckboxFilter id="booleanFlag_multinational_article" title="Has transnational organisation" label="Has transnational organisation" filter={BoolMust([RangeQuery("booleanFlag_multinational_article", {gt: false})])}/>
	    <HierarchicalRefinementFilter field="json_location_article" title="Author location" id="cats"/>
	    <HierarchicalRefinementFilter field="json_fieldOfStudy_article" title="Field of study" id="fos"/>
	    <HierarchicalRefinementFilter field="json_category_article" title="arXiv category" id="cats"/>
          </SideBar>
          <LayoutResults>
            <ActionBar>

              <ActionBarRow>
                <HitsStats translations={{
                  "hitstats.results_found":"{hitCount} results found"
                }}/>
                <ViewSwitcherToggle/>
                <SortingSelector options={[
                    {label:"Novelty", field:"metric_novelty_article", order:"desc"},
		    {label:"Search relevance", field:"_score", order:"desc"},
                  {label:"Latest Releases", field:"date_created_article", order:"desc"},
                  {label:"Earliest Releases", field:"date_created_article", order:"asc"}
                ]}/>
              </ActionBarRow>

              <ActionBarRow>
                <GroupedSelectedFilters/>
                <ResetFilters/>
              </ActionBarRow>

            </ActionBar>
            <Hits
                hitsPerPage={12}
	        highlightFields={["title_of_article", "textBody_abstract_article"]}
        sourceFilter={["title_of_article", "textBody_abstract_article", "date_created_article", "terms_authors_article", "terms_institutes_article"]}
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
