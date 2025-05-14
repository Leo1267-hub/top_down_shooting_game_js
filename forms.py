from flask_wtf import FlaskForm
from wtforms import StringField,SubmitField,PasswordField
from wtforms.validators import InputRequired,length,EqualTo


class RegistrationForm(FlaskForm):
    user_id = StringField('',validators=[InputRequired(),length(max=10)],render_kw={'placeholder':'Enter your username: ','class':'user_input'})
    password = PasswordField('',validators=[InputRequired(),length(min=5,max=15)],render_kw={'placeholder':'Create password:','class':'user_input'})
    password_confirm = PasswordField('',validators=[InputRequired(),EqualTo("password")],render_kw={'placeholder':'Confirm password:','class':'user_input'})
    submit = SubmitField('Sign up',render_kw={'class':'btn'})
    
    
class LoginForm(FlaskForm):
    user_id = StringField('',validators=[InputRequired()],render_kw={'placeholder':'Enter your username: ','class':'user_input'})
    password =PasswordField('',validators=[InputRequired()],render_kw={'placeholder':'Enter password:','class':'user_input'})
    submit = SubmitField('Login',render_kw={'class':'btn'})