<template>
  <div class="container">
    <form @submit.prevent>
      <div class="input-field">
        <label for="todo">What needs to be done?</label>
        <input
          id="todo"
          v-model="newTodo"
          type="text"
          class="validate"
          @keydown.13.prevent="addTodo"
        />
      </div>
    </form>
    <transition-group name="slide" tag="ul">
      <li
        v-for="todo in todosFiltered"
        :key="todo.id"
        class="todo-item"
        @mouseover="showIconsId = todo.id"
        @mouseleave="showIconsId = null"
      >
        <div class="todo-item-left">
          <label>
            <input v-model="todo.completed" type="checkbox" />
            <span></span>
          </label>
          <p
            v-if="editingId !== todo.id"
            :class="{ completed: todo.completed }"
            @dblclick="editTodo(todo)"
          >
            {{ todo.title }}
          </p>
          <p v-else>
            <input
              v-model="todo.title"
              v-focus
              type="text"
              @keydown.13="doneEdit(todo)"
              @blur="doneEdit(todo)"
              @keyup.esc="cancelEdit(todo)"
            />
          </p>
        </div>
        <div v-if="showIconsId === todo.id" class="icons">
          <i class="material-icons edit" @click="editTodo(todo)">edit</i>
          <i class="material-icons delete" @click="removeTodo(todo.id)"
            >delete</i
          >
        </div>
      </li>
    </transition-group>

    <div class="extra-container">
      <div>
        <label>
          <input
            type="checkbox"
            :checked="!anyRemaining"
            @change="checkAllTodos"
          />
          <span>Check All</span>
        </label>
      </div>
      <div>{{ remaining }} items left</div>
    </div>

    <div class="extra-container">
      <div class="btns">
        <a
          class="waves-effect waves-light btn"
          :class="{ active: filter === 'all' }"
          @click="filter = 'all'"
          >All</a
        >
        <a
          class="waves-effect waves-light btn"
          :class="{ active: filter === 'active' }"
          @click="filter = 'active'"
          >Active</a
        >
        <a
          class="waves-effect waves-light btn"
          :class="{ active: filter === 'completed' }"
          @click="filter = 'completed'"
          >Completed</a
        >
      </div>

      <transition name="fade">
        <a
          v-if="showClearCompletedButton"
          class="waves-effect waves-ligth btn"
          @click="clearCompleted"
          >Clear Completed</a
        >
      </transition>
    </div>
  </div>
</template>

<script>
import todoStorage from '@/services/todoStorage'

export default {
  name: 'TodoList',
  directives: {
    focus: {
      inserted(el) {
        el.focus()
      },
    },
  },
  data() {
    return {
      newTodo: '',
      beforeEditCache: '',
      showIconsId: null,
      editingId: null,
      filter: 'all',
      todos: todoStorage.fetch(),
    }
  },
  computed: {
    remaining() {
      return this.todos.filter(todo => !todo.completed).length
    },
    anyRemaining() {
      return this.remaining !== 0
    },
    todosFiltered() {
      if (this.filter === 'all') {
        return this.todos
      } else if (this.filter === 'active') {
        return this.todos.filter(todo => !todo.completed)
      } else if (this.filter === 'completed') {
        return this.todos.filter(todo => todo.completed)
      }

      return this.todos
    },
    showClearCompletedButton() {
      return this.todos.filter(todo => todo.completed).length > 0
    },
  },
  watch: {
    todos: {
      handler(todos) {
        todoStorage.save(todos)
      },
      deep: true,
    },
  },
  methods: {
    addTodo() {
      const value = this.newTodo.trim()
      if (!value) {
        return
      }

      this.todos.push({
        id: todoStorage.uid++,
        title: value,
        completed: false,
      })

      this.newTodo = ''
    },
    removeTodo(id) {
      this.todos = this.todos.filter(todo => todo.id !== id)
    },
    editTodo(todo) {
      this.beforeEditCache = todo.title
      this.editingId = todo.id
    },
    doneEdit(todo) {
      const value = todo.title.trim()
      if (!value) {
        todo.title = this.beforeEditCache
      }
      this.editingId = null
    },
    cancelEdit(todo) {
      todo.title = this.beforeEditCache
      this.editingId = null
    },
    checkAllTodos() {
      this.todos.forEach(todo => (todo.completed = event.target.checked))
    },
    clearCompleted() {
      this.todos = this.todos.filter(todo => !todo.completed)
    },
  },
}
</script>

<style lang="scss" scoped>
.todo-item {
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .todo-item-left {
    width: 85%;
    display: flex;
    align-items: center;
    padding: 10px 0;

    p {
      margin: 0;
      width: 100%;
      text-align: left;
      font-size: 16px;
    }
    label {
      display: flex;
      align-items: center;
      padding: 1px 0;
    }

    input {
      margin-bottom: 0;
      height: auto;
      padding: 0px 0 5px;
    }
  }

  .completed {
    text-decoration: line-through;
    color: grey;
  }
}

.icons {
  position: relative;
  top: 3px;

  .edit {
    cursor: pointer;
    &:hover {
      color: black;
    }
  }

  .delete {
    margin-left: 5px;
    cursor: pointer;
    &:hover {
      color: black;
    }
  }
}

.extra-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 16px;
  border-top: 1px solid lightgrey;
  padding-top: 12px;
  margin-bottom: 12px;

  span {
    color: #2c3e50;
  }
}

.btns {
  .btn {
    margin-right: 5px;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.slide {
  &-move {
    transition: transform 0.3s;
  }

  &-enter {
    opacity: 0;
    transform: translateY(5px);

    &-active {
      transition: opacity 0.3s, transform 0.3s;
    }
  }

  &-leave {
    &-active {
      transition: opacity 0.3s, transform 0.3s;
    }

    &-to {
      opacity: 0;
      transform: translateY(5px);
    }
  }
}
</style>
