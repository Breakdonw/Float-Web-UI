// install (please try to align the version of installed @nivo packages)
// yarn add @nivo/pie
import { LegendDatum, ResponsivePie, } from '@nivo/pie'
import { useCallback, useState } from 'react'

// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.
let fakedata = [
    {
        "id": "ruby",
        "label": "ruby",
        "value": 112,
        "color": "hsl(292, 70%, 50%)"
    },
    {
        "id": "css",
        "label": "css",
        "value": 558,
        "color": "hsl(264, 70%, 50%)"
    },
    {
        "id": "javascript",
        "label": "javascript",
        "value": 195,
        "color": "hsl(200, 70%, 50%)"
    },
    {
        "id": "haskell",
        "label": "haskell",
        "value": 586,
        "color": "hsl(320, 70%, 50%)"
    },
    {
        "id": "sass",
        "label": "sass",
        "value": 509,
        "color": "hsl(226, 70%, 50%)"
    }
]




const CenteredMetric = ({ dataWithArc, centerX, centerY }) => {
    let total = 0
    dataWithArc.forEach(datum => {
        total += datum.value
    })

    return (
        <>
            <text
                x={centerX}
                y={centerY}
                textAnchor="middle"
                dominantBaseline="top"
                style={{
                    fontSize: '250%',
                    fontWeight: 600,
                    fill: 'white',
                }}
            >
                ${total}
                <tspan 
                y={centerY + 30}
                    x={centerX}
                    style={{
                        color: 'white',
                        fontSize: '24%',
                    }}
                >Your monthly spend </tspan>
                                <tspan 
                y={centerY + 45}
                    x={centerX}
                    style={{
                        color: 'white',
                        fontSize: '24%',
                    }}
                >is up this month!</tspan>
            </text>

        </>
    )
}


export default function MonthlySpendingChart({ spendData, info }) {
    const [customLegends, setCustomLegends] = useState<LegendDatum<SampleDatum>[]>([])

    const valueFormat = useCallback(
        (value: number) =>
            `${Number(value).toLocaleString('ru-RU', {
                minimumFractionDigits: 2,
            })} ₽`,
        []
    )

    return (<>
        <ResponsivePie
            data={spendData}
            margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
            innerRadius={0.6}
            padAngle={0.7}
            cornerRadius={3}
            activeOuterRadiusOffset={8}
            forwardLegendData={setCustomLegends}
            borderWidth={1}
            borderColor={{
                from: 'color',
                modifiers: [
                    [
                        'darker',
                        0.2
                    ]
                ]
            }}
            arcLinkLabelsSkipAngle={10}
            arcLinkLabelsTextColor="#333333"
            arcLinkLabelsThickness={2}
            arcLinkLabelsColor={{ from: 'color' }}
            arcLabelsSkipAngle={10}
            arcLabelsTextColor={{
                from: 'color',
                modifiers: [
                    [
                        'darker',
                        -5
                    ]
                ]
            }}
            defs={[
                {
                    id: 'dots',
                    type: 'patternDots',
                    background: 'inherit',
                    color: 'rgba(255, 255, 255, 0.3)',
                    size: 4,
                    padding: 1,
                    stagger: true
                },
                {
                    id: 'lines',
                    type: 'patternLines',
                    background: 'inherit',
                    color: 'rgba(255, 255, 255, 0.3)',
                    rotation: -45,
                    lineWidth: 6,
                    spacing: 10
                }
            ]}
            fill={[
                {
                    match: {
                        id: 'ruby'
                    },
                    id: 'dots'
                },
                {
                    match: {
                        id: 'c'
                    },
                    id: 'dots'
                },
                {
                    match: {
                        id: 'go'
                    },
                    id: 'dots'
                },
                {
                    match: {
                        id: 'python'
                    },
                    id: 'dots'
                },
                {
                    match: {
                        id: 'scala'
                    },
                    id: 'lines'
                },
                {
                    match: {
                        id: 'lisp'
                    },
                    id: 'lines'
                },
                {
                    match: {
                        id: 'elixir'
                    },
                    id: 'lines'
                },
                {
                    match: {
                        id: 'javascript'
                    },
                    id: 'lines'
                }
            ]}
            legends={[
                {
                    anchor: 'bottom',
                    direction: 'row',
                    justify: false,
                    translateX: 0,
                    translateY: 56,
                    itemsSpacing: 0,
                    itemWidth: 100,
                    itemHeight: 18,
                    itemTextColor: '#999',
                    itemDirection: 'left-to-right',
                    itemOpacity: 1,
                    symbolSize: 18,
                    symbolShape: 'circle',
                    effects: [
                        {
                            on: 'hover',
                            style: {
                                itemTextColor: '#000'
                            }
                        }
                    ]
                }
            ]}
            layers={['legends','arcs', 'arcLabels', 'arcLinkLabels', CenteredMetric]}
        />
        
    
    </>)
}