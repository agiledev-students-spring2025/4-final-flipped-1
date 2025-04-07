import app from '../app.js'
import mongoose from 'mongoose'
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

  it('DELETE /api/todos/:id returns 404 for non-existent todo', done => {
    chai.request(app)
      .delete('/api/todos/9999') 
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.message).to.equal('Todo not found');
        done();
      });
  });




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

  it('GET /api/fliplog returns flip logs', done => {
    chai.request(app)
      .get('/api/fliplog')
      .end((err, res) => {
        expect(res).to.have.status(200)
        expect(res.body).to.be.an('array')
        done()
      })
  })





  // Flip Logs (MongoDB)
  // it('POST /api/fliplog/insert inserts flip log into DB and returns today total', done => {
  //   const now = new Date()
  //   const log = {
  //     task_name: 'MongoStudy',
  //     start_time: now,
  //     end_time: new Date(now.getTime() + 1000 * 60),
  //     duration: 60
  //   }
  //   chai.request(app)
  //     .post('/api/fliplog/insert')
  //     .send(log)
  //     .end((err, res) => {
  //       expect(res).to.have.status(201)
  //       expect(res.body).to.have.property('success', true)
  //       expect(res.body).to.have.property('todayTotalTime')
  //       done()
  //     })
  // })

  // it('GET /api/today/:taskName returns today total time', done => {
  //   chai.request(app)
  //     .get('/api/today/MongoStudy')
  //     .end((err, res) => {
  //       expect(res).to.have.status(200)
  //       expect(res.body).to.have.property('taskName', 'MongoStudy')
  //       expect(res.body).to.have.property('todayTotalTime')
  //       done()
  //     })
  // })
})



describe('Flip Logs (MongoDB)', () => {
  let insertedLogId = null;

  it('POST /api/fliplog/insert inserts flip log into DB and returns today total', done => {
    const now = new Date();
    const log = {
      task_name: 'MongoStudyTest',
      start_time: now,
      end_time: new Date(now.getTime() + 1000 * 60),
      duration: 60
    };

    chai.request(app)
      .post('/api/fliplog/insert')
      .send(log)
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.have.property('success', true);
        expect(res.body).to.have.property('todayTotalTime');

        insertedLogId = res.body.log._id;
        done();
      });
  });

  it('GET /api/today/:taskName returns today total time', done => {
    chai.request(app)
      .get('/api/today/MongoStudyTest')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('taskName', 'MongoStudyTest');
        expect(res.body).to.have.property('todayTotalTime');
        done();
      });
  });

  it('POST /api/fliplog/insert handles DB insert error', done => {
    // start time is not a date
    chai.request(app)
      .post('/api/fliplog/insert')
      .send({
        task_name: 'InvalidTask',
        start_time: "not-a-date",
        end_time: "not-a-date",
        duration: "NaN"
      })
      .end((err, res) => {
        expect(res).to.have.status(500);
        expect(res.body).to.have.property('error');
        done();
      });
  });

  it('GET /api/today/:taskName handles DB error', async () => {
    // connection broken to monitor error
    await mongoose.connection.close();
  
    try {
      await chai.request(app)
        .get('/api/today/TestTask');
      throw new Error('Expected failure, but got success');
    } catch (err) {
      expect(err.response).to.have.status(500);
    } finally {
      // reconnect
      await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
      console.log("Reconnected to MongoDB after simulated failure");
    }
  });
  it('PUT /api/tasks/:taskId updates a task', done => {
    chai.request(app)
      .post('/api/tasks')
      .send({ name: 'Old Task', color: '#000000' })
      .end((err, res) => {
        const taskId = res.body.task_id;
        chai.request(app)
          .put(`/api/tasks/${taskId}`)
          .send({ name: 'Updated Task', color: '#ffffff' })
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.include({ name: 'Updated Task', color: '#ffffff' });
            done();
          });
      });
  });

  it('PUT /api/tasks/:taskId returns 404 when task not found', done => {
    chai.request(app)
      .put('/api/tasks/9999') 
      .send({ name: 'Nope', color: '#000000' })
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.message).to.equal('Task not found');
        done();
      });
  });

  it('POST /api/tasks/:taskId/delete deletes a task', done => {
    chai.request(app)
      .post('/api/tasks')
      .send({ name: 'Delete Me', color: '#ff0000' })
      .end((err, res) => {
        const taskId = res.body.task_id;
        chai.request(app)
          .post(`/api/tasks/${taskId}/delete`)
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body.message).to.equal('Task deleted successfully');
            done();
          });
      });
  });

  it('POST /api/tasks/:taskId/delete returns 404 for non-existent task', done => {
    chai.request(app)
      .post('/api/tasks/9999/delete')
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.message).to.equal('Task not found');
        done();
      });
  });
  

  after(async () => {
    if (insertedLogId) {
      const FlipLog = (await import('../models/FlipLog.js')).default;
      await FlipLog.findByIdAndDelete(insertedLogId);
      console.log("Cleaned up inserted flip log");
    }
  });

  after(async () => {
    await mongoose.connection.close()
    console.log("Closed MongoDB connection after tests")
  })

});
