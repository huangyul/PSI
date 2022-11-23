<template>
  <div class="about">
    <v-header @open-task-list="openTaskList" />
    <v-sidebar />
    <div class="content-box" :class="{ 'content-collapse': collapse }">
      <v-tags></v-tags>
      <div class="content">
        <router-view v-slot="{ Component }">
          <transition name="move" mode="out-in">
            <keep-alive :include="tagsList">
              <component :is="Component" />
            </keep-alive>
          </transition>
        </router-view>
        <!-- <el-backtop target=".content"></el-backtop> -->
      </div>
    </div>
    <TaskList v-model:is-show="isTaskShow"></TaskList>
  </div>
</template>
<script>
  import { computed, ref } from 'vue'
  import { useStore } from 'vuex'
  import vHeader from '../components/Header.vue'
  import vSidebar from '../components/Sidebar.vue'
  import vTags from '../components/Tags.vue'
  import TaskList from '../components/TaskList.vue'
  export default {
    components: {
      vHeader,
      vSidebar,
      vTags,
      TaskList,
    },
    data() {
      return {
        isTaskShow: false,
      }
    },
    methods: {
      openTaskList() {
        this.isTaskShow = true
      },
    },
    setup() {
      const store = useStore()
      const tagsList = computed(() =>
        store.state.tagsList.map((item) => item.name)
      )

      const collapse = computed(() => store.state.collapse)
      return {
        tagsList,
        collapse,
      }
    },
  }
</script>
