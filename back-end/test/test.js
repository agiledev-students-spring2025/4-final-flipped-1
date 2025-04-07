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
    chai.request(app)
      .post('/api/todos')
      .send({
        date: '2025-04-06',
        toDo: 'Write tests',
        time: '12:00',
        TimeRange: '1h'
      })
      .end((err, res) => {
        expect(res).to.have.status(200)
        expect(res.body).to.include({ toDo: 'Write tests' })
        done()
      })
  })

  it('DELETE /api/todos/:id deletes a todo', done => {
    const tempTodo = {
      date: '2025-04-07',
      toDo: 'Temp',
      time: '09:00',
      TimeRange: '15min'
    }
    chai.request(app)
      .post('/api/todos')
      .send(tempTodo)
      .end((err, res) => {
        const id = res.body.id
        chai.request(app)
          .delete(`/api/todos/${id}`)
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
        expect(res).to.have.status(200)
        expect(res.body).to.be.an('array')
        expect(res.body[0]).to.have.property('name')
        done()
      })
  })

  it('POST /api/tasks adds a task', done => {
    chai.request(app)
      .post('/api/tasks')
      .send({ name: 'Test Task', color: '#abc123' })
      .end((err, res) => {
        expect(res).to.have.status(201)
        expect(res.body).to.include({ name: 'Test Task' })
        done()
      })
  })

  it('POST /api/tasks/:taskId/time updates time for task', done => {
    chai.request(app)
      .post('/api/tasks')
      .send({ name: 'Timed Task', color: '#ffeeaa' })
      .end((err, res) => {
        const taskId = res.body.task_id
        chai.request(app)
          .post(`/api/tasks/${taskId}/time`)
          .send({ timeSpent: 3600 })
          .end((err, res) => {
            expect(res).to.have.status(200)
            expect(res.body.success).to.be.true
            expect(res.body.task.totalTime).to.equal(3600)
            done()
          })
      })
  })

  // Flip Logs (Mock)
  it('GET /api/fliplog returns flip logs', done => {
    chai.request(app)
      .get('/api/fliplog')
      .end((err, res) => {
        expect(res).to.have.status(200)
        expect(res.body).to.be.an('array')
        done()
      })
  })

  it('POST /api/fliplog adds a new flip log & returns total', done => {
    chai.request(app)
      .post('/api/fliplog')
      .send({
        task_name: 'Study',
        date: '2025.04.06',
        start_time: '14:00:00',
        end_time: '14:30:00',
        duration: 1800
      })
      .end((err, res) => {
        expect(res).to.have.status(201)
        expect(res.body.success).to.be.true
        expect(res.body.todayTotalTime).to.be.a('number')
        done()
      })
  })

  // Flip Logs (MongoDB)
  it('POST /api/fliplog/insert inserts flip log into DB and returns today total', done => {
    const now = new Date()
    const log = {
      task_name: 'MongoStudy',
      start_time: now,
      end_time: new Date(now.getTime() + 1000 * 60),
      duration: 60
    }
    chai.request(app)
      .post('/api/fliplog/insert')
      .send(log)
      .end((err, res) => {
        expect(res).to.have.status(201)
        expect(res.body).to.have.property('success', true)
        expect(res.body).to.have.property('todayTotalTime')
        done()
      })
  })

  it('GET /api/today/:taskName returns today total time', done => {
    chai.request(app)
      .get('/api/today/MongoStudy')
      .end((err, res) => {
        expect(res).to.have.status(200)
        expect(res.body).to.have.property('taskName', 'MongoStudy')
        expect(res.body).to.have.property('todayTotalTime')
        done()
      })
  })
})
