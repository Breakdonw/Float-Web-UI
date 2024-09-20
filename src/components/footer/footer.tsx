
function Footer() {

    return (
        <>
            <footer className='flex flex-row w-screen justify-between items-center mb-3'>
                <p className="ml-auto">Made with ❤️ and lots of 🍵 in Ohio</p>
                <div className='place-self-center ml-auto ' >
                    <div className="space-x-6 mr-5  underline ">
                        <a className="text-white hover:text-slate-600  visited:text-slate-400" href="https://github.com/Breakdonw/Float-Web-UI/wiki">Help</a>
                        <a className="text-white hover:text-slate-600  visited:text-slate-400" href="https://github.com/Breakdonw/Float-Web-UI">Github</a>
                    </div>
                </div>
            </footer>
        </>
    )
}

export default Footer
