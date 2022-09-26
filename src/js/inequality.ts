const minAge: number = 0;
const beginWorkingAge: number = 18;
const retirementAge: number = 65;
const maxAge: number = 100;


const startingIncome0: number = 0;
const startingIncome80: number = 100000;
const startingIncome100: number = 400000;


function ageProbability(ageInYears: number): number {
    /*
    Ages: 0 to 100
    Probability: Uniform from 0-65, declining linearly from 65-100.
    Source: Eyeballed from https://www.indexmundi.com/united_states/age_structure.html
    p(x) = {
        0                       ; x < 0
        (1/82.5)                ; 0 <= x < 65
        (1/82.5) * (100-x)/35   ;  x <= 65 <= 100
        0                       ; 100 < x
    }
    */
    let normalizationConstant = 82.5;
    if (ageInYears < minAge || ageInYears > maxAge) {
        return 0;
    }
    if (ageInYears < retirementAge) {
        return 1 / normalizationConstant;
    } else {
        return (1 / normalizationConstant) * ((maxAge - ageInYears) / (maxAge - retirementAge));
    }
}


function linearIncomeMultipleByAge(ageInYears: number): number {
    /* 
    Ages: 18 to 65
    Growth: Linear, from 1x at 18 to 2x at 65
    Source: Eyeballed a Mckinsey graph, https://www.mckinsey.com/business-functions/people-and-organizational-performance/our-insights/human-capital-at-work-the-value-of-experience
    income(age) = {
        0                       ; x < 18
        1 + ((x - 18) / 47)     ; 18 <= x  < 65
        0                       ; 65 < x
    }
    */
    if (ageInYears < beginWorkingAge || ageInYears > retirementAge) {
        return 0;
    }
    return 1 + ((ageInYears - beginWorkingAge) / (retirementAge - beginWorkingAge));
}


function startingIncomeByPercentile(percentile: number) {
    /*
    Percentiles: 0 to 100 (not 0 to 1.0)
    Growth: 
        * linear from percentile 0% to 80% (income $0 to $100k)
        * linear plus exponential from 80% to 100% (income $100k to $400k)
    Source: Eyeballed https://dqydj.com/income-percentile-by-age-calculator/
    income(percentile) = {
        100,000 * ((80 - x) / 80)
            + e^(((x - 80)/20) * ln(375,000))       ; the e^(...) term is effectively 0 from 0% to 80%
    }
    */

    let linearComponent: (p: number) => number = (p: number): number => { 
        return (startingIncome80 - startingIncome0) * (p / 80);
    }
    let exponentialComponent: number = Math.exp(
        ((percentile - 80)/20)
        * Math.log(startingIncome100 - linearComponent(100))
        );
    return linearComponent(percentile) + exponentialComponent;
}


interface Sampler {
    sample: () => number
}


const ageSampler: Sampler = {
    sample: () => {
        // Rejection sampling
        while (true) {
            let ageSample: number = minAge + (Math.random() * (maxAge - minAge));
            let probSample: number = Math.random();
            if (probSample < ageProbability(ageSample)) {
                return ageSample;
            }
        }
    }
}


const startingIncomeSampler: Sampler = {
    sample: () => {
        // Inverse transform sampling
        return startingIncomeByPercentile(Math.random() * 100);
    }
}


export {
    ageProbability,
    linearIncomeMultipleByAge,
    startingIncomeByPercentile,
    ageSampler,
    startingIncomeSampler,
    minAge,
    beginWorkingAge,
    retirementAge,
    maxAge,
};