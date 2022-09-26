import {
    minAge,
    beginWorkingAge,
    retirementAge,
    maxAge,
} from "./inequality.js"

import * as d3 from "./d3.min.js"

function colorForAge(ageInYears: number): string {
    let colorScale = d3.interpolateRgb("#1B7F79", "#72F2EB");
    let linearScale = d3.lienarScale().domain([minAge, maxAge]).range(0, 1);    
    if (ageInYears < beginWorkingAge) {
        return "#FF4858";
    } else if (ageInYears < retirementAge) {
        return colorScale(linearScale(ageInYears));
    }
    return "#747F7F";
}

export {
    colorForAge
}