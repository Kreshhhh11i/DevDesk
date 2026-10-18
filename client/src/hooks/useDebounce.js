import React, { useState, useEffect } from 'react'

export const useDebounce = (value, time) => {

    const [debouncedSearch, setDebouncedSearch] = useState("")
    useEffect(() => {
        const delay = setTimeout(() => {
            setDebouncedSearch(value);
        }, time);
        return () => {
            clearTimeout(delay);
        };
    }, [value,time]);
    return { debouncedSearch};

}
