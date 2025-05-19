const AuthLayout = ({ children }: { children: React.ReactNode }) => {
    return (  
        <div className="bg-red-100 h-full">
            {children}
        </div>
    );
}
 
export default AuthLayout;