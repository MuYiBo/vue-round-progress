# vue-round-progress

> It's a circular progress bar component developed using Vue

 [![vue2](https://img.shields.io/badge/vue-2.x-brightgreen.svg)](https://vuejs.org/)


### How to use?
```bash
npm install vue-round-progress
```

### Example

```vue
<template>
  <vue-round-progress 
    :value='value' 
    :lineColor='lineColor' 
    :lineDash='lineDash'
    :lineDashDefault='lineDashDefault'
    :duration='2000'>
  </vue-round-progress>
</template>

<script>
  import vueRoundProgress from 'vue-round-progress';
  export default {
    components: { vueRoundProgress },
    data () {
      return {
        value: 80,
        lineColor: "#ff6699",
        lineDash: [3, 3],
        lineDashDefault: [1, 5]
      }
    }
  }
</script>
```



### Options
|    Property    |    Description   |   type   |	default	|
| -----------------  | ---------------- | :--------: | :----------: |
| value       | Ring value |Number| 0 |
| maxValue         | The maximum value of the ring |Number | 100 |
| size  | The diameter of the ring, in px | Number | 225 |
| lineWidth     | Border line thickness in px | Number | 20 |
| lineColor     | Border color with value | String | '#ff9c38' |
| lineColorDefault     | Default border color | String | '#eeeeee' |
| lineDash     | Valued border line dash line [solid line length, gap length] | Array |  |
| lineDashDefault     | Default border line dash line [solid line length, gap length] | Array |  |
| startAge     | Starting angle, calculated from 0 o'clock at 6 o'clock | Number | 0 |
| endAge     | End angle | Number | 360 |
| duration     | Duration in millisecond | Number | 2000 |
| showText     | Whether to display value text | Boolean | true |
| textStyle     | Style of value text | Object | { color: "#000", fontSize: "60px" } |


 ### Functions
| Function Name | Description   |
| :--------:   | -----  |
|    restart    |  Re-rendering the value (re-rendering the parameter value after passing the parameter)  |
|    changeValue    |  Change from previous value to the parameter value passed in |