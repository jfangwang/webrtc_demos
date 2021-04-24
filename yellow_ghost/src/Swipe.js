import React, { useState } from 'react';
import './Swipe.css';

function Counter() {
    const [count, setCount] = useState(0);
    return (
        <div>
            <p>Counter: {count}</p>
            <button onClick={() => {
                setCount(count + 1)
            }}>counter</button>
        </div>
    )
}

class test extends React.Component {
    constructor(props){
        super(props);
    }
    render() {
        return (
            <body>
                <Counter />
            </body>
        )
    }
}
export default test;