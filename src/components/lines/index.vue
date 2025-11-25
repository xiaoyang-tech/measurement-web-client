<script>
import { computedSymbol } from "../../utils/report-config";
import { h } from 'vue'
export default {
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    label: {
      type: String,
      default: () => "",
    },
    score: {
      type: Number,
      default: () => 0,
    },
  },
  render() {
    let color = "#FF5252";
    const { data, label } = this;
    let score = this.score;
    // if (['心血管病风险'].includes(label)) {
    //   score = Number((score * 100).toFixed(2))
    //   // Math.floor(score * 100)
    // }
    // if (['中风风险', '心脏病风险'].includes(label)) {
    //   score = Number((score * 100).toFixed(2))
    //   // Math.floor(score * 100 * 100) / 100
    // }

    if (["心率", "收缩压", "舒张压"].includes(label)) {
      score = parseInt(score + "");
    } else if (["中风风险", "心脏病风险", "心血管病风险"].includes(label)) {
      score = Number((score * 100).toFixed(2));
    } else {
      score = Math.floor(score * 100) / 100;
    }
    if (score >= 0) {
      const row = data.find(({ min, max, symbol }) =>
        computedSymbol(symbol, min, max, score)
      );
      color = (row && row.color) || "#FF5252";
    }
    if (label === "房颤") {
      color = score === 0 ? "#6EDAA9" : "#FF5252";
    }
    return h(
      "div",
      {
        class: "echarts-list",
      },
      [
        h("div", { class: "label" }, [
          h(
            "div",
            { class: "key", style: { color: color } },
            `${score}${
              ["血氧饱和度", "心脏病风险", "心血管病风险", "中风风险"].includes(label)
                ? "%"
                : ""
            }`
          ),
          // h('div', { class: 'text' }, label)
        ]),
        h("div", { class: "content" }, [
          h("div", { class: "local" }, [
            ...data.map(({ min, max }, index) => {
              return h(
                "span",
                {
                  style: {
                    width: 100 / data.length + "%",
                  },
                },
                (index === 0 && score < min) ||
                  (score >= min && score < max) ||
                  (index === data.length - 1 && score >= max)
                  ? [
                      h("div", {
                        class: "absolute",
                        style: {
                          left:
                            index === 0 && score < min
                              ? "0px"
                              : `calc(${((score - min) / (max - min)) * 100}% - 7px)`,
                        },
                      }),
                    ]
                  : ""
              );
            }),
          ]),
          h("div", { class: "bg" }, [
            ...data.map(({ color }) => {
              return h("div", {
                style: { width: 100 / data.length + "%", background: color },
              });
            }),
          ]),
          h("div", { class: "num" }, [
            h("div", data[0].min),
            ...data.map(({ max }) => {
              return h("div", max);
            }),
          ]),
        ]),
      ]
    );
  },
};
</script>
<style lang="scss" scoped>
.echarts-list {
  display: flex;
  padding: 7px 0;
  cursor: pointer;
  align-items: center;
  .label {
    width: 100px;
    .key {
      font-size: 16px;
      font-weight: 600;
      padding-left: 10px;
      line-height: 22px;
    }
    .text {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: #4d4d4d;
      font-size: 14px;
      line-height: 22px;
    }
  }
  .content {
    flex: 1;
    position: relative;
    margin-left: 7px;
    color: #999;
    font-size: 14px;
    .local {
      position: absolute;
      left: 0;
      right: 0;
      height: 7px;
      display: flex;
      span {
        height: 7px;
        position: relative;
        .absolute {
          position: absolute;
          width: 17px;
          height: 17px;
          top: -6px;
          background-color: #fff;
          border: 1px solid #ddd;
          border-radius: 50%;
        }
      }
    }
    .bg {
      display: flex;
      div {
        height: 7px;
        &:first-child {
          border-top-left-radius: 4px;
          border-bottom-left-radius: 4px;
        }
        &:last-child {
          border-top-right-radius: 4px;
          border-bottom-right-radius: 4px;
        }
      }
    }
    .num {
      display: flex;
      justify-content: space-between;
      padding: 7px 0 0;
      font-size: 14px;
      color: #999;
    }
  }
}
</style>
