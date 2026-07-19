
import React from 'react';

const Logo: React.FC = () => {
    return (
        <div className="relative flex items-center justify-center">
            <img
                src="/images/logo.png"
                alt="Brokerless Realty logo"
                className="relative z-10 h-auto w-[100px] md:w-[160px] transition-all"
            />
        </div>
    );
};

export default Logo;
