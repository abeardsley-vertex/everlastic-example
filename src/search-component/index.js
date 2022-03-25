import React from "react";

import './search.css';

export default class Search extends React.Component {

    constructor(props)
    {
        super(props);

        this.state = {
            search: '',
            suggestions: [],
            searchtimeout: null,
            results: {},
            isSearching: false
        }

        this.handleSearchEnter = this.handleSearchEnter.bind(this);
        this.handleSearchChange = this.handleSearchChange.bind(this);
        this.doSearch = this.doSearch.bind(this);
    }

    handleSearchEnter(event) {
        var value = event.target.value;
        if(value && value.length > 0 && event.keyCode == 13){
            this.doSearch(value);
         }
    }

    handleSearchChange(event) {
        clearTimeout(this.state.searchTimeout)

        var value = event.target.value;

        if (!value || value.length <= 0)
        {
            this.setState({ 
                search: '',
                suggestions: [] 
            })

            return;
        };

        this.setState({
            search: value,
            //debounce easy mode - prevent sending request on every keystroke unless N milliseconds have gone by
            searchTimeout: setTimeout(() => {
                this.getSuggestions(value);
              }, 200)
        });
    }

    doSearch(value)
    {
        console.log("do search for: ", value);
        this.setState({ 
            search: value,
            suggestions: [],
            results: {},
            isSearching: true
        });

        let searchUrl= "https://everlastic.net/api/search/?includeKeymatches=true&page=1&pageSize=20&index=www.austinregionalclinic.com&highlightPre=%3Cstrong%3E&highlightPost=%3C/strong%3E&limitKeymatchesToStartsWith=true&q=" + value;
        fetch(searchUrl)
        .then(res => res.json())
        .then(
          (result) => {
              this.setState({
                  results: result,
                  isSearching: false
            });
          },
          // Note: it's important to handle errors here
          // instead of a catch() block so that we don't swallow
          // exceptions from actual bugs in components. 
          (error) => {
              console.log("ERROR getting suggestions:", error);
              this.setState({
                results: {},
                isSearching: false
          });
          }
        )
    }

    getSuggestions(value)
    {
        let everlasticSuggestUrl = "https://everlastic.net/api/searchcompletion/suggest?page=1&pagesize=20&size=10&verbose=false&index=www.austinregionalclinic.com&search=" + value;

        fetch(everlasticSuggestUrl)
        .then(res => res.json())
        .then(
          (result) => {
              console.log("Got suggestions:", result);
              this.setState({suggestions: result});
          },
          // Note: it's important to handle errors here
          // instead of a catch() block so that we don't swallow
          // exceptions from actual bugs in components. 
          (error) => {
              console.log("ERROR getting suggestions:", error);
          }
        )
    }

    render() {
        const { suggestions, results, isSearching } = this.state;

        return (
            <div className="Search">
                <h2>Everlastic Search - ARC</h2>
                <input type="text" placeholder="Search..." value={this.state.search} onChange={this.handleSearchChange} onKeyUp={this.handleSearchEnter} />
                {
                    (suggestions && suggestions.length > 0) &&
                    <div className="suggestionsContainer">
                        <ul>
                            {suggestions.map(suggestion => (
                                <li key={suggestion} onClick={() => this.doSearch(suggestion)}>
                                    {suggestion}
                                </li>
                            ))}
                        </ul>
                    </div>
                }

                {
                    isSearching &&
                    <div className="searching">Searching...</div>
                }

                {           
                    (results && results.Results && results.Results.length > 0) &&
                    <div>
                        {results.Results.map((result, index) => (
                            <div className="searchResultContainer" key={ index }>
                               <h4><a href={result._source.url}>{result._source.title}</a></h4>
                               <div className="searchResultDetails">
                                    <div>{result._source.url}</div>
                                    <div dangerouslySetInnerHTML={{ __html: result.highlight }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                }
            </div>
        );
    }
}