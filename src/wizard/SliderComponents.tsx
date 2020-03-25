// From https://github.com/sghall/react-compound-slider/blob/master/docs/src/demos/horizontal/components.tsx

/*
License:

MIT License

Copyright (c) 2017 Steven Hall

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
 */

import * as React from 'react';
import {GetHandleProps, GetRailProps, GetTrackProps, SliderItem,} from 'react-compound-slider';

// *******************************************************
// RAIL
// *******************************************************
const railOuterStyle = {
    position: 'absolute' as 'absolute',
    width: '100%',
    height: 42,
    transform: 'translate(0%, -50%)',
    borderRadius: 7,
    cursor: 'pointer',
};

const railInnerStyle = {
    position: 'absolute' as 'absolute',
    width: '100%',
    height: 14,
    transform: 'translate(0%, -50%)',
    borderRadius: 7,
    pointerEvents: 'none' as 'none',
    backgroundColor: 'rgb(155,155,155)',
};

interface SliderRailProps {
    getRailProps: GetRailProps;
}

export const SliderRail: React.FC<SliderRailProps> = ({getRailProps}) => {
    return (
        <>
            <div style={railOuterStyle} {...getRailProps()} />
            <div style={railInnerStyle}/>
        </>
    );
};

// *******************************************************
// HANDLE COMPONENT
// *******************************************************
interface HandleProps {
    domain: number[];
    handle: SliderItem;
    getHandleProps: GetHandleProps;
    disabled?: boolean;
}

export const Handle: React.FC<HandleProps> = ({
                                                  domain: [min, max],
                                                  handle: {id, value, percent},
                                                  disabled = false,
                                                  getHandleProps,
                                              }) => {
    return (
        <>
            <div
                style={{
                    left: `${percent}%`,
                    position: 'absolute',
                    transform: 'translate(-50%, -50%)',
                    WebkitTapHighlightColor: 'rgba(0,0,0,0)',
                    zIndex: 5,
                    width: 28,
                    height: 42,
                    cursor: 'pointer',
                    backgroundColor: 'none',
                }}
                {...getHandleProps(id)}
            />
            <div
                role="slider"
                aria-valuemin={min}
                aria-valuemax={max}
                aria-valuenow={value}
                style={{
                    left: `${percent}%`,
                    position: 'absolute',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 2,
                    width: 24,
                    height: 24,
                    borderRadius: '50%',
                    boxShadow: '1px 1px 1px 1px rgba(0, 0, 0, 0.3)',
                    backgroundColor: disabled ? '#666' : '#9BBFD4',
                }}
            />
        </>
    );
};

// *******************************************************
// KEYBOARD HANDLE COMPONENT
// Uses a button to allow keyboard events
// *******************************************************
export const KeyboardHandle: React.FC<HandleProps> = ({
                                                          domain: [min, max],
                                                          handle: {id, value, percent},
                                                          disabled = false,
                                                          getHandleProps,
                                                      }) => {
    return (
        <button
            role="slider"
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={value}
            style={{
                left: `${percent}%`,
                position: 'absolute',
                transform: 'translate(-50%, -50%)',
                zIndex: 2,
                width: 24,
                height: 24,
                borderRadius: '50%',
                boxShadow: '1px 1px 1px 1px rgba(0, 0, 0, 0.3)',
                backgroundColor: disabled ? '#666' : '#9BBFD4',
            }}
            {...getHandleProps(id)}
        />
    );
};

// *******************************************************
// TRACK COMPONENT
// *******************************************************
interface TrackProps {
    source: SliderItem;
    target: SliderItem;
    getTrackProps: GetTrackProps;
    disabled?: boolean;
}

export const Track: React.FC<TrackProps> = ({
                                                source,
                                                target,
                                                getTrackProps,
                                                disabled = false,
                                            }) => {
    return (
        <div
            style={{
                position: 'absolute',
                transform: 'translate(0%, -50%)',
                height: 14,
                zIndex: 1,
                backgroundColor: disabled ? '#999' : '#607E9E',
                borderRadius: 7,
                cursor: 'pointer',
                left: `${source.percent}%`,
                width: `${target.percent - source.percent}%`,
            }}
            {...getTrackProps()}
        />
    );
};

// *******************************************************
// TICK COMPONENT
// *******************************************************
interface TickProps {
    tick: SliderItem;
    count: number;
    format?: (val: number) => string;
}

export const Tick: React.FC<TickProps> = ({tick, count, format = d => d}) => {
    return (
        <div>
            <div
                style={{
                    position: 'absolute',
                    marginTop: 14,
                    width: 1,
                    height: 5,
                    backgroundColor: 'rgb(200,200,200)',
                    left: `${tick.percent}%`,
                }}
            />
            <div
                style={{
                    position: 'absolute',
                    marginTop: 22,
                    fontSize: 10,
                    textAlign: 'center',
                    marginLeft: `${-(100 / count) / 2}%`,
                    width: `${100 / count}%`,
                    left: `${tick.percent}%`,
                }}
            >
                {format(tick.value)}
            </div>
        </div>
    );
};