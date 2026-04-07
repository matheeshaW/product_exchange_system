import { useEffect } from 'react';
import api from '../api/axios';


const Home = () => {

    useEffect(() => {
        const test = async () => {
            try {
                const res = await api.get('/items');
                console.log('ITEMS:', res.data);
            } catch (err) {
                console.error('ERROR:', err);
            }
        };

        test();
    }, []);

    return (
        <div className="home">
            <h1>Welcome to the Inventory System</h1>
            <p>This is the home page. You can navigate to other pages from here.</p>
        </div>
    );
};

export default Home;