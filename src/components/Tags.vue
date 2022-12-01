<template>
  <div class="tags" v-show="showTags" id="tags">
    <ul>
      <li
        class="tags-li"
        v-for="(item, index) in tagsList"
        :class="{ active: isActive(item.path) }"
        :key="index"
      >
        <router-link :to="item.path" class="tags-li-title">{{
          item.title
        }}</router-link>
        <span
          class="tags-li-icon"
          @click="closeTags(index)"
          v-show="item.name != 'dashboard'"
        >
          <i class="el-icon-close"></i>
        </span>
      </li>
    </ul>
    <!-- <div class="tags-close-box">
            <el-dropdown @command="handleTags">
                <el-button size="mini" type="primary">
                    标签选项
                    <i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <template #dropdown>
                    <el-dropdown-menu size="small">
                        <el-dropdown-item command="other">关闭其他</el-dropdown-item>
                        <el-dropdown-item command="all">关闭所有</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div> -->
  </div>
</template>

<script>
  import $ from 'jquery'
  import { computed } from 'vue'
  import { useStore } from 'vuex'
  import { onBeforeRouteUpdate, useRoute, useRouter } from 'vue-router'
  export default {
    setup() {
      const route = useRoute()
      const router = useRouter()
      const isActive = (path) => {
        return path === route.fullPath
      }

      const store = useStore()
      const tagsList = computed(() => store.state.tagsList)
      const showTags = computed(() => tagsList.value.length > 0)

      // 关闭单个标签
      const closeTags = (index) => {
        const delItem = tagsList.value[index]
        store.commit('delTagsItem', { index })
        const item = tagsList.value[index]
          ? tagsList.value[index]
          : tagsList.value[index - 1]
        if (item) {
          delItem.path === route.fullPath && router.push(item.path)
        } else {
          router.push('/')
        }
      }

      // 设置标签
      const setTags = (route) => {
        const isExist = tagsList.value.some((item) => {
          return item.path === route.fullPath
        })
        if (!isExist) {
          //超出5个标签开始删除最前面一个标签
          if (tagsList.value.length >= 5) {
            //store.commit("delTagsItem", { index: 0 });
            //$("#tags ul").scrollLeft($("#tags ul").outerWidth(true));
          }
          store.commit('setTagsItem', {
            name: route.name,
            title: route.meta.title,
            path: route.fullPath,
          })
        }
      }
      setTags(route)
      onBeforeRouteUpdate((to) => {
        setTags(to)
      })

      // 关闭全部标签
      const closeAll = () => {
        store.commit('clearTags')
        router.push('/')
      }
      // 关闭其他标签
      const closeOther = () => {
        const curItem = tagsList.value.filter((item) => {
          return item.path === route.fullPath
        })
        store.commit('closeTagsOther', curItem)
      }
      const handleTags = (command) => {
        command === 'other' ? closeOther() : closeAll()
      }

      // 关闭当前页面的标签页
      // store.commit("closeCurrentTag", {
      //     $router: router,
      //     $route: route
      // });

      return {
        isActive,
        tagsList,
        showTags,
        closeTags,
        handleTags,
      }
    },
    mounted() {},
  }
</script>

<style>
  .tags {
    position: relative;
    height: 30px;
    overflow: hidden;
    background: #e5e5e5;
    padding-right: 0px;
    /* box-shadow: 0 1px 5px #e8e9ea; */
  }

  .tags ul {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    overflow: auto;
    white-space: nowrap;
    display: flex;
  }
  .tags ul::-webkit-scrollbar {
    display: none;
  }

  .tags-li {
    float: left;
    font-size: 12px;
    overflow: hidden;
    cursor: pointer;
    height: 30px;
    line-height: 30px;
    border-right: 1px solid #d2d2d2;
    padding: 0 10px 0 15px;
    vertical-align: middle;
    color: #767b83;
    display: flex;
    align-items: center;
    flex: none;
  }
  .tags-li:hover {
    background-color: #dedfdf;
  }
  .tags-li > span > i {
    padding: 1px;
    font-weight: bold;
    line-height: 12px;
  }
  .tags-li > span > i:hover {
    background-color: #b9babb;
    color: #fff;
    border-radius: 100%;
  }

  .tags-li:not(.active):hover {
  }

  .tags-li.active {
    background-color: #fff;
    border: none;
  }

  .tags-li-title {
    float: left;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    padding: 0 5px 0 0;
    color: #767b83;
    font-size: 14px;
  }

  .tags-li.active .tags-li-title {
    color: #579ff6;
    font-weight: bold;
  }

  .tags-close-box {
    position: absolute;
    right: 0;
    top: 0;
    box-sizing: border-box;
    padding-top: 1px;
    text-align: center;
    width: 110px;
    height: 30px;
    background: #fff;
    box-shadow: -3px 0 15px 3px rgba(0, 0, 0, 0.1);
    z-index: 10;
  }
</style>
