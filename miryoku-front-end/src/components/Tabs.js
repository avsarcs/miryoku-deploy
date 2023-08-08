import React, { Component } from "react"
import PropTypes from "prop-types"
import Tab from "./Tab"

class Tabs extends Component {
    static propTypes = {
        children: PropTypes.instanceOf(Array).isRequired,
    }

    constructor(props) {
        super(props)

        let activeIndex

        for (let i = 0; i < this.props.children.length; i++) {

            if (this.props.children[i].props.isVisible === undefined || this.props.children[i].props.isVisible === true) {
                activeIndex = i
                break
            }

        }

        this.state = {
            activeTab: this.props.children[activeIndex].props.label,
            customClass: this.props.customClass
        }
    }

    onClickTabItem = (tab) => {
        this.setState({activeTab: tab})
    }

    render() {
        const {
            onClickTabItem,
            props: {
                children,
            },
            state: {
                activeTab,
                customClass
            }
        } = this

        return (
            <div className={customClass ? ("tabs-" + customClass) : "tabs"}>
                <ol className={customClass ? ("tab-list-" + customClass) : "tab-list"}>
                    {children.map( (child, index) => {
                        const { label, isVisible, onClick: customOnClick } = child.props
                        
                        return (
                            <div onClick={customOnClick ? customOnClick : () => {}}>
                                <Tab
                                    activeTab={activeTab}
                                    style={isVisible === undefined ? {} : (isVisible === true ? {} : {"display": "none"})}
                                    key={index}
                                    label={label}
                                    customClass={customClass}
                                    onClick={onClickTabItem}
                                />
                            </div>
                        )

                    })}
                </ol>
                <div className={customClass ? ("tab-content-" + customClass) : "tab-content"}>
                    {children.map((child) => {
                        if (child.props.label !== activeTab) return undefined
                        return child.props.children
                    })}
                </div>
            </div>
        )
    }

}

export default Tabs;