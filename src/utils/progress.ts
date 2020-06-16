/**
 *
 * @Description: 进度条类
 * @Author: Owen
 * @Date: 2019-06-19 14:48
 *
 */

interface Progress {
  start(): any
  close(): any
}

interface ProgressConfig {
  color?: string
  height?: number
  className?: string
}

const defaultConfig: ProgressConfig = {
  color: '#409EFF',
  height: 3,
  className: 'progress-anamation'
}

class Progress {
  el: HTMLDivElement
  color: string
  height: number
  className: string
  currentProgress: number = -100
  status: string = 'pedding'

  constructor(config: ProgressConfig) {
    let { color, height, className } = Object.assign(defaultConfig, config)

    this.color = color!
    this.height = height!
    this.className = className!
    this.el = this.createProgress()
    this.mountProgress()
  }

  /**
   *
   * @description: 创建进度条
   * @param {}
   * @return {}
   *
   */

  private createProgress(): HTMLDivElement {
    let el: HTMLDivElement

    el = document.createElement('div')
    el.setAttribute('id', 'progress-block')
    el.setAttribute('style', `height: ${ this.height }px; background-color: ${ this.color };`)

    return el
  }

  /**
   *
   * @description: 挂载进度条
   * @param {}
   * @return {}
   *
   */

  private mountProgress() {
    let body = document.body

    body.appendChild(this.el!)
  }

  /**
   *
   * @description: 启动滚动条
   * @param {}
   * @return {}
   *
   */

  public start() {
    this.status = 'start'
    this.animate()
  }

  /**
   *
   * @description: 动画函数
   * @param {}
   * @return {}
   *
   */

  private animate() {
    const speed = this.randomSpeed()

    requestAnimationFrame(() => {

      this.currentProgress += speed

      if (this.currentProgress > -5 &&
        this.status === 'end'
      ) {
        setTimeout(() => {
          this.currentProgress = -100
          this.css(`${ this.currentProgress }%`, 0)
        }, 200)
        return
      }

      let xValue: string = `${ this.currentProgress > -5 ? -5 : this.currentProgress }`
      let util: string = `${ this.currentProgress > -5 ? 'px' : '%' }`
      this.css(xValue + util, 1)
      this.animate()

    })
  }

  /**
   *
   * @description: 获取一个随机速度
   * @param {}
   * @return {}
   *
   */

  private randomSpeed(): number {
    const randomNum = Math.random()
    return randomNum > 0.5 ? randomNum * 3 : randomNum * 8
  }

  /**
   *
   * @description: 设置css
   * @param {xValue} x 轴的值
   * @param {opacity} 透明度
   * @return {}
   *
   */

  private css(xValue: string | number, opacity: number) {
    this.el.style.cssText = `
          height: ${ this.height }px;
          background-color: ${ this.color };
          transform: translateX(${ xValue });
          opacity: ${ opacity }
        `
  }

  /**
   *
   * @description: 关闭滚动条
   * @param {}
   * @return {}
   *
   */

  public close() {
    this.status = 'end'
    this.currentProgress = 0
    this.css(0, 1)
  }
}

/**
 *
 * @description: 实例化进度条实例
 * @param {config} 配置项
 * @return {}
 *
 */

function create(config: ProgressConfig) {
  const progress: Progress = new Progress(config)

  return progress
}


export default create
