import React, { Component } from "react"
import PropTypes from "prop-types"


class Tab extends Component {
    static propTypes = {
        activeTab: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        onClick: PropTypes.func.isRequired,
        customClass: PropTypes.string.isRequired
    }

    onClick = () => {
        const { label, onClick } = this.props
        onClick(label)
    }

    render() {
        const {
            onClick,
            props: {
                activeTab,
                label,
                style,
                customClass
            },
        } = this

        let className = customClass ? ("tab-list-item-" + customClass) : "tab-list-item"

        if (activeTab === label) {
            className += customClass ? (" tab-list-active-" + customClass) : " tab-list-active"
        }

        return (
            <li
                className={className}
                style={style}
                onClick={onClick}
            >
                {label}
            </li>
        )
    }
}

export default Tab;