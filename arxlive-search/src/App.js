import React, { Component } from 'react'
import extend from 'lodash/extend'
import { SearchkitManager,SearchkitProvider,
  SearchBox, RefinementListFilter, Pagination,
  HierarchicalMenuFilter, HitsStats, SortingSelector, NoHits,
	 ResetFilters, RangeFilter, NumericRefinementListFilter, ViewSwitcherHits, ViewSwitcherToggle, DynamicRangeFilter, Hits, HitItemProps,
  InputFilter, GroupedSelectedFilters,
  Layout, TopBar, LayoutBody, LayoutResults,
  ActionBar, ActionBarRow, SideBar } from 'searchkit'
import './index.css'


const host = "https://lf3922vot1.execute-api.eu-west-2.amazonaws.com/v00/cliosearch/meetup_v2/"
const searchkit = new SearchkitManager(host, {
    httpHeaders:{"Content-Type":"application/json",
		 "X-Api-Key":"wXLnActJhY7r0XUDIWNXc6y6tGYUUnBU1eeU7Stu",
		 "Es-Endpoint":"search-health-scanner-5cs7g52446h7qscocqmiky5dn4.eu-west-2.es.amazonaws.com",
		}
})

const HitItem = (props)=> {    
  const {bemBlocks, result} = props
  const source = extend({}, result._source)
  return (
	  <div className={bemBlocks.item().mix(bemBlocks.container("item"))} data-qa="hit">
	  <div className={bemBlocks.item("subitem")}>
	  <a href={source.url_of_group} target={source.url_of_group}><h2 className={bemBlocks.item("name_of_group")} dangerouslySetInnerHTML={{__html:source.name_of_group}}></h2></a>
	  <h3 className={bemBlocks.item("date_start_group")} dangerouslySetInnerHTML={{__html:source.date_start_group}}></h3>
	  <br></br>
          <div className={bemBlocks.item("textBody_descriptive_group")} dangerouslySetInnerHTML={{__html:source.textBody_descriptive_group}} data-qa="textBody_descriptive_group"></div>
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
            <SearchBox autofocus={true} searchOnChange={false} prefixQueryFields={["name_of_group^10", "textBody_descriptive_group"]}/>
          </TopBar>
        <LayoutBody>

          <SideBar>
            <RangeFilter min={0} max={3000} field="count_member_group" id="count_member_group" title="Number of members" showHistogram={true}/>
            <InputFilter id="placeName_continent_group" searchThrottleTime={500} title="Continent" placeholder="Search continent" searchOnChange={true} queryFields={["placeName_continent_group"]} />
            <RefinementListFilter id="terms_topics_group" title="Topics" field="terms_topics_group.keyword" operator="OR"/>
	    {/* Note the above doesn't work since you need to set raw fields like here https://gitter.im/searchkit/searchkit/archives/2017/12/31 */}
          </SideBar>
          <LayoutResults>
            <ActionBar>

              <ActionBarRow>
                <HitsStats translations={{
                  "hitstats.results_found":"{hitCount} results found"
                }}/>
                <ViewSwitcherToggle/>
                <SortingSelector options={[
                  {label:"Relevance", field:"_score", order:"desc"},
                  {label:"Latest Releases", field:"date_start_group", order:"desc"},
                  {label:"Earliest Releases", field:"date_start_group", order:"asc"}
                ]}/>
              </ActionBarRow>

              <ActionBarRow>
                <GroupedSelectedFilters/>
                <ResetFilters/>
              </ActionBarRow>

            </ActionBar>
            <Hits
                hitsPerPage={12}
	        highlightFields={["name_of_group", "textBody_descriptive_group"]}
                sourceFilter={["name_of_group", "textBody_descriptive_group", "url_of_group", "date_start_group"]}
                itemComponent={HitItem}
	        mod="sk-hits-list"
                scrollTo="body"
            />
            <NoHits suggestionsField={"name_of_group"}/>
            <Pagination showNumbers={true}/>
          </LayoutResults>

          </LayoutBody>
        </Layout>
      </SearchkitProvider>
    );
  }
}

export default App;
