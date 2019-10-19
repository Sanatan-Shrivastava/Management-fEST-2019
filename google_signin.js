var provider = null;
function start(){
    var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithRedirect(provider);
    //   window.alert(typeof(start));
}