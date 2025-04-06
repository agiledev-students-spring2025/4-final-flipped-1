import app from '../app.js'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)

const chai = require('chai')
const chaiHttp = require('chai-http')

chai.use(chaiHttp)
const { expect } = chai

describe('Full API Test Suite', () => {
  // Todos
  it('GET /api/todos returns a list of todos', done => {
    chai.request(app)
      .get('/api/todos')
      .end((err, res) => {
        expect(err).to.be.null
        expect(res).to.have.status(200)
        expect(res.body).to.be.an('array')
        expect(res.body[0]).to.have.property('toDo')
        done()
      })
  })

  it('POST /api/todos adds a new todo', done => {
    const newTodo = {
      date: '2025-04-06',
      toDo: 'Write full test suite',
      time: '12:00',
      TimeRange: '1h'
    }

    chai.request(app)
      .post('/api/todos')
      .send(newTodo)
      .end((err, res) => {
        expect(res).to.have.status(200)
        expect(res.body).to.include({ toDo: 'Write full test suite' })
        done()
      })
  })

  it('DELETE /api/todos/:id deletes a todo by id', done => {
    const tempTodo = {
      date: '2025-04-07',
      toDo: 'Temporary Task',
      time: '09:00',
      TimeRange: '30min'
    }

    chai.request(app)
      .post('/api/todos')
      .send(tempTodo)
      .end((err, res) => {
        const todoId = res.body.id
        chai.request(app)
          .delete(`/api/todos/${todoId}`)
          .end((err, res) => {
            expect(res).to.have.status(200)
            expect(res.body.message).to.equal('Todo deleted')
            done()
          })
      })
  })

  // Tasks
  it('GET /api/tasks returns a list of tasks', done => {
    chai.request(app)
      .get('/api/tasks')
      .end((err, res) => {
        expect(err).to.be.null
        expect(res).to.have.status(200)
        expect(res.body).to.be.an('array')
        expect(res.body[0]).to.have.property('name')
        done()
      })
  })

  it('POST /api/tasks adds a new task', done => {
    const newTask = {
      name: 'Focus Study',
      color: '#112233'
    }

    chai.request(app)
      .post('/api/tasks')
      .send(newTask)
      .end((err, res) => {
        expect(res).to.have.status(200)
        expect(res.body).to.include({ name: 'Focus Study' })
        done()
      })
  })

  /*it('POST /api/tasks/:taskId/time updates time for a task', done => {
    const timeUpdate = { timeSpent: 3600 }

    chai.request(app)
      .post('/api/tasks')
      .send({ name: 'Timed Task', color: '#ffeeaa' })
      .end((err, res) => {
        const taskId = res.body.id
        chai.request(app)
          .post(`/api/tasks/${taskId}/time`)
          .send(timeUpdate)
          .end((err, res) => {
            expect(res).to.have.status(200)
            expect(res.body.success).to.be.true
            expect(res.body.task.totalTime).to.equal(3600)
            done()
          })
      })
  })*/

  // Flip Log
  it('GET /api/fliplog returns flip logs', done => {
    const log = {
      task_name: 'Study',
      date: '2025.04.06',
      start_time: '14:00:00',
      end_time: '14:30:00',
      duration: 1800
    }

    chai.request(app)
      .post('/api/fliplog')
      .send(log)
      .end(() => {
        chai.request(app)
          .get('/api/fliplog')
          .end((err, res) => {
            expect(res).to.have.status(200)
            expect(res.body).to.be.an('array')
            expect(res.body[0]).to.have.property('task_name')
            done()
          })
      })
  })

  it('POST /api/fliplog adds a new flip log and returns daily total', done => {
    const newLog = {
      task_name: 'Study',
      date: '2025.04.06',
      start_time: '14:00:00',
      end_time: '14:30:00',
      duration: 1800
    }

    chai.request(app)
      .post('/api/fliplog')
      .send(newLog)
      .end((err, res) => {
        expect(res).to.have.status(201)
        expect(res.body).to.have.property('success', true)
        expect(res.body.log).to.include({ task_name: 'Study' })
        expect(res.body).to.have.property('todayTotalTime')
        done()
      })
  })
})
