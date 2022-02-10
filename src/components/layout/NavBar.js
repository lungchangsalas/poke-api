import react from "react";

function Navbar(){
    return (
        <div>
            <nav className='navbar navbar-expand-md navbar-dark bg-dark fixed-top text-center'>
                <a href='/' className='navbar-brand col-sm-3 col-md-2 mr-0'>Pokedex</a>
            </nav>
        </div>
    );
}

export { Navbar };