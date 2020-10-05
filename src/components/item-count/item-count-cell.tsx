import React from 'react'
import { styled } from "styletron-react";

type PropsType = {
    itemName: String;
    itemCount: number;
    color: string;
}

const Box = styled("div", (props: PropsType) => {
    return {
        color: props.color,
        border: "solid 1px gray"
    }
});


export default function ItemCountCell(props: PropsType) {

    return (
        <Box>
            <h2>{props.itemName}</h2>
            <p>{props.itemCount}</p>
        </Box>
    )
}