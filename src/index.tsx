import React from "react"
import ReactDOM from "react-dom"
import { Value } from "reactive-magic"
import Component from "reactive-magic/component"
import { css } from "glamor"

css.global("body", {
	margin: 0,
	padding: 0,
})

class Counter extends Component<{}> {
	count = new Value(0)

	inc = () => this.count.update(x => x + 1)
	dec = () => this.count.update(x => x - 1)

	view() {
		return (
			<div>
				<button onClick={this.dec}>
					{"-"}
				</button>
				<span>
					{this.count.get()}
				</span>
				<button onClick={this.inc}>
					{"+"}
				</button>
			</div>
		)
	}
}

const root = document.createElement("div")
document.body.appendChild(root)

ReactDOM.render(<Counter />, root)
