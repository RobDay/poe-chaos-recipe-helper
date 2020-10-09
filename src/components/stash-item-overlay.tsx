import React from 'react';
import { styled } from "styletron-react";
import { StashItem } from '../models';

export type PropsType = {
    color: string,
    width: string,
    height: string,
    top: string,
    left: string,
    onStashItemClicked: (stashItem: StashItem) => void
    // item: StashItem
}

const Container = styled("div", (props: PropsType) => {
    return {
        position: "absolute",
        opacity: "50%",
        backgroundColor: props.color,
        width: props.width,
        height: props.height,
        left: props.left,
        top: props.top
    }
});

export default function StashItemOverlay(props: PropsType) {

    return (
        <Container {...props}>

        </Container>
    )
}