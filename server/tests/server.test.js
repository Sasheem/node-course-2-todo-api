const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

// dummy array to populate db for testing
const todos = [{
  text: 'first test todo'
}, {
  text: 'second test todo'
}, {
  text: 'third test todo'
}];

// runs before every test case, and will only move on to test case until we call done
// which means we can do something async here
beforeEach((done) => {
  // wipes all todos with an empty object here
  Todo.remove({}).then(() => {
    // CONTINUE HERE AT 2:21 lec titled 'Testing GET /todos'
    return Todo.insertMany(todos);
  }).then(() => done());
});

describe('POST /todos',  () => {

  it('should create a new todo', (done) => {
    var text = 'Test todo text';

    request(app)
      .post('/todos')
      .send({text})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if (err) {
          // pass error into done, printing error to screen
          return done(err);
        }

        // here we make request to db fetching all todos to verify our one todo
        // was added
        Todo.find({text}).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((e) => done(e));   // pass error into done
      });
  });

  // verifies that a todo does not get created when we send bad data
  it('should not create todo with invalid body data', (done) => {
    request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find().then((todos) => {
          expect(todos.length).toBe(3);
          done();
        }).catch((e) => done(e));
      });
  });
});

describe('GET /todos', () => {
  it('should get all todos', (done) => {
    request(app)
      .get('/todos')
      .expect(200)
      .expect((res) => {
      expect(res.body.todos.length).toBe(3);
    }).end(done);
  });
});
