from flask import Flask, render_template, url_for, request, redirect

app = Flask(__name__)

@app.route("/")
@app.route("/names=<string:names>")
@app.route("/roles=<string:roles>")
@app.route("/names=<string:names>&roles=<string:roles>")
def main_page(names="", roles=""):
    return render_template("index.html", names=names, roles=roles)


if __name__ == "__main__":
    app.run(debug=True)