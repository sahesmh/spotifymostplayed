import React, { Component } from 'react';

class List extends Component {
    
    // Initialise the State
    constructor(props) {
        super(props);
        this.state = {
            list: []
        }
    }

    // Fetch the list when the component is first mounted
    componentDidMount() {
        this.getList();
    }

    getList = () => {
        fetch('/api/placeholder')
        .then(res => res.json())
        .then(list => this.setState({ list }))
    }

    render() {
        const { list } = this.state;
        return (
            <div className="App"> 
                <h1>List of Items</h1>
                {/* Check to see if any items are found (ternary) */}
                {list.length ? (
                    <div>
                        {/* Render item list */}
                        {list.map((item) => {
                            return(
                                <div>
                                    {item}
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div>
                        <h2>No List Items Found</h2>
                    </div>
                )
            }
            </div>
        );
    }
}

export default List;