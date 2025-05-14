from flask import Flask,render_template,redirect,url_for,session,g,request
from database import get_db,close_db
from forms import RegistrationForm,LoginForm
from werkzeug.security import generate_password_hash,check_password_hash
from flask_session import Session
from functools import wraps


app = Flask(__name__)
app.config['SECRET_KEY'] = 'brovski'
app.teardown_appcontext(close_db)
app.config["SESSION_PERMANENT"] = False
app.config['SESSION_TYPE'] = 'filesystem'
Session(app)

@app.before_request
def logged_in_user():
    g.user = session.get('user',None)
    
def login_required(view):
    @wraps(view)
    def wrapped_view(*args,**kwargs):
        if g.user is None: #if user from above function is none then it goes to login and go back where you were by adding it to url
            return redirect(url_for('login',next = request.url))
        return view(*args,**kwargs)
    return wrapped_view


@app.route("/")
def index():
    return render_template("index.html", title = 'Main')

@app.route('/login',methods=['GET','POST'])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        user_id = form.user_id.data
        password = form.password.data   
        db = get_db()
        user = db.execute("""SELECT * FROM user
                                   WHERE user_id = ?;""",(user_id,)).fetchone()
        if user is None:
            form.user_id.errors.append('user id doesnt exist')        
        elif not check_password_hash(user['password'],password):
            form.password.errors.append('wrong password')
        else:
            session.clear()
            session['user'] = user_id
            next_page = request.args.get('index')
            if not next_page:
                    next_page = url_for('index')
            return redirect(next_page)
    return render_template('login.html',form=form,title='Login')


@app.route('/logout')
def logout():
    session.clear()
    session.modified = True
    return redirect(url_for('index'))



@app.route('/register',methods=['GET','POST'])
def register():
    form = RegistrationForm()
    if form.validate_on_submit():
        user_id = form.user_id.data
        password = form.password.data
        db = get_db()
        clash = db.execute(f"""SELECT * FROM user
                                   WHERE user_id = ?;""",(user_id,)).fetchone()
        if clash is not None:
            form.user_id.errors.append('user id already taken')
        else:
            db.execute(f"""INSERT INTO user (user_id,password)
                                VALUES (?,?);""",(user_id,generate_password_hash(password)))
            db.commit()
            return redirect(url_for('login'))
    return render_template('register.html',form=form,title = 'Registration')

@app.route("/play")
@login_required
def play():
    return render_template("game.html")

@app.route("/store_score", methods=["POST"])
def store_score():
    score = int(request.form["score"])
    cheats = request.form["cheats"]
    db = get_db()
    user_in_leaderboard = db.execute("""SELECT * FROM leaderboard 
                                     WHERE user_id = ?""",(session['user'],)).fetchone()
    if user_in_leaderboard is not None:
        last_score = user_in_leaderboard['score']
        if score > last_score:
            db.execute("""UPDATE leaderboard SET score = ?, cheats = ?
                       WHERE user_id = ?""",(score,cheats,session['user']))
    else:
        db.execute("""INSERT INTO leaderboard(user_id,score,cheats)
                   VALUES (?,?,?);""",(session['user'],score,cheats))
    db.commit()
    return 'success'

@app.route("/leaderboard")
def leaderboard():
    db = get_db()
    leaderboard = db.execute("""SELECT * FROM leaderboard
                             ORDER BY score DESC;""").fetchall()
    return render_template("leaderboard.html",leaderboard = leaderboard, title = 'leaderboard')

@app.route("/instructions")
def instruction():
    return render_template("instructions.html",title="Instructions")