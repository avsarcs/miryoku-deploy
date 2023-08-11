import React, { useEffect, useState } from "react";
import ArtworkCard from "../components/ArtworkCard";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { useUser } from "../context/UserContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightLong, faLeftLong } from "@fortawesome/free-solid-svg-icons";
import { isEqual } from "lodash";

export default function Feed(props) {

    const [searchData, setSearchData] = React.useState({
        name: "",
        Music: false,
        Painting: false,
        Fiction: false,
        Poetry: false,
        Cinema: false,
        Photography: false,
        Other: false,
        before: "",
        after: "",
        tags: []
    })

    const navigate = useNavigate()

    const TAG_LIMIT = 5

    const [artworks, setArtworks] = useState([])
    const { user } = useUser()

    // PAGINATION
    const [searchParams, setSearchParams] = useSearchParams()
    const [currentPage, setCurrentPage] = useState(1)
    const [maxPages, setMaxPages] = useState(1)
    const [searchQuery, setSearchQuery] = useState('')

    useEffect(() => {

        if (searchParams.get("page")) {
            setCurrentPage(searchParams.get("page"))
        } else {
            setCurrentPage(1)
        }

    }, [searchParams])

    // END OF PAGINATION RELATED CODE

    // Populate artworks
    useEffect(() => {

        if (currentPage) {
            const populateArtworks = async () => {
                const fetchedArtworks = await axios.get(`/artwork?page=${currentPage}${searchQuery}`)
                setArtworks(fetchedArtworks.data.docs)
                setMaxPages(parseInt(fetchedArtworks.data.totalPages))
            }
            populateArtworks()
        }
    
    }, [currentPage, searchQuery])

    // Create a search query string based on the searchData state. This function is called whenever the search button is clicked.
    // Also sets the page to 1 so that the user gets the first results of the query.
    const createSearchQuery = () => {
        if ( isEqual(searchData,
            {
                name: "",
                Music: false,
                Painting: false,
                Fiction: false,
                Poetry: false,
                Cinema: false,
                Photography: false,
                Other: false,
                before: "",
                after: "",
                tags: []
            }
        ))
        {
            setSearchQuery('')
        }
        else {
            let query = ''

            if (searchData.Music) {
                query += "&types[]=Music"
            }

            if (searchData.Painting) {
                query += "&types[]=Painting"
            }

            if (searchData.Fiction) {
                query += "&types[]=Fiction"
            }

            if (searchData.Poetry) {
                query += "&types[]=Poetry"
            }

            if (searchData.Cinema) {
                query += "&types[]=Cinema"
            }

            if (searchData.Photography) {
                query += "&types[]=Photography"
            }

            if (searchData.Other) {
                query += "&types[]=Other"
            }

            for (let tag in searchData.tags) {
                query += `&tags[]=${searchData.tags[tag]}`
            }

            if (searchData.before) {
                query += `&before=${searchData.before}`
            }

            if (searchData.after) {
                query += `&after=${searchData.after}`
            }

            if (searchData.name) {
                query += `&title=${searchData.name.trim()}`
            }

            setSearchQuery(query)
        }
    }

    const [tagsJSX, setTagsJSX] = React.useState([])
    const [tag, setTag] = React.useState("")

    const [filterMenuOpen, setFilterMenuOpen] = React.useState(false)

    const [tagLimitWarning, setTagLimitWarning] = React.useState(false)

    // Updates searchData as the user enters text into the search bar or enables filters.
    function handleChange(e) {

        const { name, value, type, checked } = e.target

        setSearchData( (prevSearchData) => {
            return {
                ...prevSearchData,
                [name]: type === "checkbox" ? checked : value
            }
        })
    }

    // Handles tag input change
    function handleTagChange(e) {
        setTag(e.target.value)
    }

    // Updates searchData.tags as user enters or deletes tags
    function handleTagClick(e) {

        const cleanTag = tag.trim().toLowerCase()

        if (cleanTag && searchData.tags.length < TAG_LIMIT) {
            setSearchData( (prevSearchData) => {
                    return {
                        ...prevSearchData,
                        tags: [...prevSearchData.tags, cleanTag]
                    }
                })   
        }

        if (searchData.tags.length >= TAG_LIMIT) {
            setTagLimitWarning(true)
        }

            setTag("")       
    }

    // Removes tag when a tag label is clicked.
    function removeTag(tag) {

        const tagIndex = searchData.tags.indexOf(tag)

        setSearchData((prevSearchData) => {
            return {
                ...prevSearchData,
                tags: prevSearchData.tags.slice(0, tagIndex).concat( prevSearchData.tags.slice(tagIndex + 1) )
            }
        })
    }       
    

    // Maps all the tags to JSX elements
    React.useEffect( () => {
        setTagsJSX( () => {
            return searchData.tags.map( (tag, index) => {
                const cleanTag = tag.trim().toLowerCase()
                return (
                    <label className="cool-label tag-label" onClick={() => removeTag(cleanTag)} name={cleanTag} key={index}>{cleanTag}</label>
                )
            } )
        } )
    }, [searchData])


    return (
        <div className="feed-container">
            <div className="desc-and-widget-container">
                <div className="desc-container">
                    <h1>Discover artworks</h1>
                    <h2>Help others by giving them feedback.</h2>
                    <div className="toggle-filter-menu"></div>
                </div>
                <div className="feed-create-container">
                    <i className="fas fa-palette fa-5x feed-palette"></i>
                    <Link to="/create" style={{"textDecoration": "none"}}>
                        <button className="feed-create-button" type="button">Create New Artwork</button>
                    </Link>
                </div>
            </div>

            <div className="feed-body">
                <div className="search-container">

                <form>

                <div className="search-components">

                    <input className="search-bar" name="name" value={searchData.name} onChange={handleChange} type="text" placeholder="Search..."/>

                    
                    <div className="buttons-next-to-search-bar">
                        <button className="search-button submit" onClick={createSearchQuery} type="button"><i className="gg-search"></i></button>
                        <button className="search-button filter" type="button" onClick={
                            () => {
                                setFilterMenuOpen( filterMenuOpen => !filterMenuOpen)
                            }
                        }>Filter results</button>
                    </div>

                </div>

                <div className="toggle-filter-menu" style={{
                    maxHeight: filterMenuOpen ? "70vh" : "0vh",
                    opacity: filterMenuOpen ? "1" : "0",
                    overflow: "hidden",
                    transition: "opacity 1s, max-height 1s",
                }}>
                <span className="filter-desc">Select the types you want to include (if none, all will be included):</span>
                    <div className="type-filter filter-sub">
                            <input className="hide" type="checkbox" name="Music" id="Music" checked={searchData.Music} onChange={handleChange} />
                            <label className={`cool-label ${searchData.Music ? "type-selected" : ""}`} htmlFor="Music">Music</label>

                            <input className="hide" type="checkbox" name="Painting" id="Painting" checked={searchData.Painting} onChange={handleChange} />
                            <label className={`cool-label ${searchData.Painting ? "type-selected" : ""}`} htmlFor="Painting">Painting</label>

                            <input className="hide" type="checkbox" name="Fiction" id="Fiction" checked={searchData.Fiction} onChange={handleChange} />
                            <label className={`cool-label ${searchData.Fiction ? "type-selected" : ""}`} htmlFor="Fiction">Fiction</label>
                            
                            <input className="hide" type="checkbox" name="Poetry" id="Poetry" checked={searchData.Poetry} onChange={handleChange} />
                            <label className={`cool-label ${searchData.Poetry ? "type-selected" : ""}`} htmlFor="Poetry">Poetry</label>

                            <input className="hide" type="checkbox" name="Cinema" id="Cinema" checked={searchData.Cinema} onChange={handleChange} />
                            <label className={`cool-label ${searchData.Cinema ? "type-selected" : ""}`} htmlFor="Cinema">Cinema</label>

                            <input className="hide" type="checkbox" name="Photography" id="Photography" checked={searchData.Photography} onChange={handleChange} />
                            <label className={`cool-label ${searchData.Photography ? "type-selected" : ""}`} htmlFor="Photography">Photography</label>

                            <input className="hide" type="checkbox" name="Other" id="Other" checked={searchData.Other} onChange={handleChange} />
                            <label className={`cool-label ${searchData.Other ? "type-selected" : ""}`} htmlFor="Other">Other</label>

                    </div>

                    <div className="date-filter filter-sub">
                        <div className="before-date-wrapper">
                        Before: <input className="date-input" name="before" value={searchData.before} onChange={handleChange} type="date"/>
                        </div>
                        <div className="after-date-wrapper">
                        After: <input className="date-input" name="after" value={searchData.after} onChange={handleChange} type="date" />
                        </div>
                    </div>

                    <span className="filter-desc">Write any tags you want to specifically search for:</span>

                    <div className="tag-filter filter-sub">
                        <input className="tag-text-input" onChange={handleTagChange} value={tag} name="tags" type="text" maxLength="35"/>
                        <button type="button" onClick={handleTagClick} className="add-tag-button">Add tag</button>
                        {tagsJSX} 
                    </div>
                    <span className="tag-limit-warning filter-desc">{`${tagLimitWarning ? "You can search for at most five tags at a time" : ""}`}</span>
                        
                    </div>

                </form>

                </div>

                <div className="cards-container">
                    {
                        artworks.length > 0 && artworks?.map((artwork) => {return (
                            <ArtworkCard artwork={artwork} />
                        )})
                    }
                
                </div>
                <div className="margin-top margin-bottom page-buttons">
                    { currentPage > 1 ?
                        <button onClick={() => {setCurrentPage((currentPage) => currentPage - 1)}} style={{"all": "unset", "cursor": "pointer"}}>
                            <FontAwesomeIcon className="margin-right" icon={faLeftLong} size="2xl"/>
                        </button>
                        :
                        <div className="margin-right"></div>
                    }
                    <div className="sleek-text slightly-larger">{currentPage}</div>
                    { currentPage < maxPages ?
                        <button onClick={() => {setCurrentPage((currentPage) => currentPage + 1)}} style={{"all": "unset", "cursor": "pointer"}}>
                            <FontAwesomeIcon className="margin-left" icon={faRightLong} size="2xl"/>
                        </button>
                        :
                        <div className="margin-left"></div>
                    }
                    
                </div>

            </div>
        </div>
    )
    }

