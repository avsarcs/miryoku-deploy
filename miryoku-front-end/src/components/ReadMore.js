import React, { useState } from "react"
import { useEffect } from "react";
  
const ReadMore = ({ children }) => {
  const text = children || "";
  const [isReadMore, setIsReadMore] = useState(true);

  const [showReadMore, setShowReadMore] = useState(false)

  useEffect(() => {
    setShowReadMore(text.length > 500)
  }, [text])

  const toggleReadMore = () => {
    setIsReadMore(!isReadMore);
  };
  return (
    <p className="read-more-text">
      {isReadMore ? text.slice(0, 500) : text}
      { showReadMore ? 
      <span onClick={toggleReadMore} className="read-or-hide">
        {isReadMore ? "...read more" : " show less"}
      </span>
      : ""
    }
    </p>
  );
};
  
  
export default ReadMore;