
import { ResponsiveLine } from '@nivo/line'

// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.
const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0, // You can adjust this based on how many decimal places you need
  }).format(value);
};


export const Linechart = ({ spendData }) => (
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
      min:'auto',
      max:'auto'
    }}
    axisLeft={{
      legend: 'Balance',
      tickPadding:4,
      format: formatCurrency, // Apply custom formatting function for Y-axis
      legendPosition:'end',
      legendOffset: 12,
      
    }}
    axisBottom={{
      format: '%b %d',
      tickValues: 'every 3 month',
      legend: 'Time scale',
      legendOffset: -12,
    }}
    axisTop={null}
    theme={{
      "text": {
        "fontSize": 11,
        "fill": "#ffffff",
        "outlineWidth": 0,
        "outlineColor": "#ffffff"
      },
      "tooltip": {
        "wrapper": {},
        "container": {
          "background": "#ffffff",
          "color": "#333333",
          "fontSize": 12
        },
        "basic": {},
        "chip": {},
        "table": {},
        "tableCell": {},
        "tableCellValue": {}
      }
    }}
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