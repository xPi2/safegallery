import {useState} from 'react';

interface ImageProps {
    src: string
}

function FramedImage(props: ImageProps) {
        const [loaded, setLoaded] = useState(false);
        return (
        <div>
            {!loaded ? (
                <svg width="100%" height="100%" viewBox="0 0 100 100">
                    <rect width="100" height="100" fill="rgb(209 213 219)"/>
                </svg>
            ) : null}
            <img
                src={props.src}
                className="border-4 border-black"
                style={!loaded ? { visibility: 'hidden', height: '0', border: '0'} : {}}
                onLoad={() => setLoaded(true)}
            />
        </div>
    )};

export default FramedImage;
