
import { ResponsiveLine } from '@nivo/line'
import { color } from 'chart.js/helpers'
const data = [
    {
      "id": "japan",
      "color": "hsl(300, 70%, 50%)",
      "data": [
        {
          "x": "plane",
          "y": 54
        },
        {
          "x": "helicopter",
          "y": 258
        },
        {
          "x": "boat",
          "y": 217
        },
        {
          "x": "train",
          "y": 104
        },
        {
          "x": "subway",
          "y": 88
        },
        {
          "x": "bus",
          "y": 249
        },
        {
          "x": "car",
          "y": 0
        },
        {
          "x": "moto",
          "y": 134
        },
        {
          "x": "bicycle",
          "y": 299
        },
        {
          "x": "horse",
          "y": 270
        },
        {
          "x": "skateboard",
          "y": 21
        },
        {
          "x": "others",
          "y": 266
        }
      ]
    },
    {
      "id": "france",
      "color": "hsl(218, 70%, 50%)",
      "data": [
        {
          "x": "plane",
          "y": 27
        },
        {
          "x": "helicopter",
          "y": 26
        },
        {
          "x": "boat",
          "y": 166
        },
        {
          "x": "train",
          "y": 201
        },
        {
          "x": "subway",
          "y": 16
        },
        {
          "x": "bus",
          "y": 18
        },
        {
          "x": "car",
          "y": 256
        },
        {
          "x": "moto",
          "y": 29
        },
        {
          "x": "bicycle",
          "y": 63
        },
        {
          "x": "horse",
          "y": 268
        },
        {
          "x": "skateboard",
          "y": 142
        },
        {
          "x": "others",
          "y": 248
        }
      ]
    },
    {
      "id": "us",
      "color": "hsl(41, 70%, 50%)",
      "data": [
        {
          "x": "plane",
          "y": 49
        },
        {
          "x": "helicopter",
          "y": 258
        },
        {
          "x": "boat",
          "y": 224
        },
        {
          "x": "train",
          "y": 176
        },
        {
          "x": "subway",
          "y": 152
        },
        {
          "x": "bus",
          "y": 176
        },
        {
          "x": "car",
          "y": 256
        },
        {
          "x": "moto",
          "y": 32
        },
        {
          "x": "bicycle",
          "y": 176
        },
        {
          "x": "horse",
          "y": 94
        },
        {
          "x": "skateboard",
          "y": 0
        },
        {
          "x": "others",
          "y": 70
        }
      ]
    },
    {
      "id": "germany",
      "color": "hsl(4, 70%, 50%)",
      "data": [
        {
          "x": "plane",
          "y": 266
        },
        {
          "x": "helicopter",
          "y": 220
        },
        {
          "x": "boat",
          "y": 216
        },
        {
          "x": "train",
          "y": 116
        },
        {
          "x": "subway",
          "y": 274
        },
        {
          "x": "bus",
          "y": 211
        },
        {
          "x": "car",
          "y": 71
        },
        {
          "x": "moto",
          "y": 218
        },
        {
          "x": "bicycle",
          "y": 27
        },
        {
          "x": "horse",
          "y": 32
        },
        {
          "x": "skateboard",
          "y": 219
        },
        {
          "x": "others",
          "y": 197
        }
      ]
    },
    {
      "id": "norway",
      "color": "hsl(64, 70%, 50%)",
      "data": [
        {
          "x": "plane",
          "y": 297
        },
        {
          "x": "helicopter",
          "y": 292
        },
        {
          "x": "boat",
          "y": 2
        },
        {
          "x": "train",
          "y": 199
        },
        {
          "x": "subway",
          "y": 286
        },
        {
          "x": "bus",
          "y": 153
        },
        {
          "x": "car",
          "y": 24
        },
        {
          "x": "moto",
          "y": 65
        },
        {
          "x": "bicycle",
          "y": 64
        },
        {
          "x": "horse",
          "y": 73
        },
        {
          "x": "skateboard",
          "y": 126
        },
        {
          "x": "others",
          "y": 145
        }
      ]
    }
  ]
// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.
export const Linechart = ({  spendData}) => (
    <ResponsiveLine
        data={spendData}
        margin={{ top: 50, right: 80, bottom: 50, left: 50 }}
        xScale={{
          type: 'time',
          format: '%Y-%m-%d',
          useUTC: false,
          precision: 'day',
      }}
      xFormat="time:%Y-%m-%d"
      yScale={{
          type: 'linear',
          // stacked: boolean('stacked', false),
      }}
      axisLeft={{
          legend: 'linear scale',
          legendOffset: 12,
      }}
      axisBottom={{
          format: '%b %d',
          tickValues: 'every 2 days',
          legend: 'time scale',
          legendOffset: -12,
      }}
      axisTop={null}
      theme={{"text": {
        "fontSize": 11,
        "fill": "#ffffff",
        "outlineWidth": 0,
        "outlineColor": "#ffffff"
    },}}
      axisRight={null}
        pointSize={10}
        pointColor={{ theme: 'background' }}
        pointBorderWidth={2}
        pointBorderColor={{ from: 'serieColor' }}
        pointLabel="data.yFormatted"
        pointLabelYOffset={-12}
        enableArea={true}
        areaOpacity={0.55}
        enableTouchCrosshair={true}
        useMesh={true}
        enableSlices={false}
        legends={[
            {
                anchor: 'bottom-right',
                direction: 'column',
                justify: false,
                translateX: 100,
                translateY: 0,
                itemsSpacing: 0,
                itemDirection: 'left-to-right',
                itemWidth: 80,
                itemHeight: 20,
                itemOpacity: 0.75,
                symbolSize: 12,
                symbolShape: 'circle',
                symbolBorderColor: 'rgba(255, 255, 255, .5)',
                effects: [
                    {
                        on: 'hover',
                        style: {
                            itemBackground: 'rgba(0, 0, 0, .03)',
                            itemOpacity: 1
                        }
                    }
                ]
            }
        ]}
    />
)