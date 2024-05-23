import { createContext, useState,useEffect} from "react";

export const MarketplaceContext = createContext()

export default function MarketplaceProvider({children}){

    const apiEndpoint = "http://127.0.0.1:5000"

    const contextData = {
       apiEndpoint
         
    };
    
    
        return (
            <MarketplaceContext.Provider value={contextData}>
                {children}
            </MarketplaceContext.Provider>
        );

}

