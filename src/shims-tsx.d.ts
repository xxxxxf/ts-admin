import Vue, { VNode } from 'vue';
import { Instance } from '@/types/request.type';

declare global {
  namespace JSX {
    // tslint:disable no-empty-interface
    interface Element extends VNode {}
    // tslint:disable no-empty-interface
    interface ElementClass extends Vue {}
    interface IntrinsicElements {
      [elem: string]: any;
    }
    //
    interface Vue {

    }
  }
  // 给 Window 添加全局属性
  interface Window {
    token: string | null
    $filterData: ((source: any, rules: any) => any)
    $request: Instance
    $imageStabilization: (callback: any, timeout?: number) => void
    $message: any | null
    $loading: any | null
    $confirm: any | null
    $checkRequired: any
  }
}
