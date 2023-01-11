import Vue from 'vue'
import DataDict from '../dict'
import { getDicts as getDicts } from '@/api/modules/page'

function install() {
  Vue.use(DataDict, {
    metas: {
      '*': {
        labelField: 'dictLabel',
        valueField: 'dictValue',
        request(dictMeta) {
          return getDicts(dictMeta.type).then(res => res.data)
        },
      },
    },
  })
}

export default {
  install,
}