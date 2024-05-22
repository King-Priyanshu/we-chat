import { useRef, useState } from "react"
import { resizeFile } from "../../helpers";
import ImageCropper from "./ImageCropper";
import { config } from "../../../config";


function Button({ text, isCancel, onButtonClick }) {
    return (
        <div onClick={onButtonClick} className={`w-full border light:border-light-line dark:border-dark-line flex justify-center h-10 items-center light:bg-light-secondary dark:bg-dark-secondary cursor-pointer ${isCancel ? 'hover:bg-common-danger' : 'hover:bg-common-success'} transition duration-50`}>
            {text}
        </div>
    )
}


export default function ProfilePfp({ image, setPfp }) {

    const [uploadedImage, setUploadedImage] = useState(null);

    const [showChangePfpModal, setShowChangePfpModal] = useState(false);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState({});



    const imageInputRef = useRef(null);


    async function handleConfirmClick(name, value) {

        try {
            const token = localStorage.getItem('user:token');
            const response = await fetch(config.serverURL + "/api/updatepfp", {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                    'Authorization': token
                },
                body: JSON.stringify({pfp: value})
            });

            const data = await response.json();
            if(!response.ok){
                return;
            }
            setPfp(value);

        }
        catch (e) {

        }

    }


    function handleCropComplete(croppedArea, fCroppedAreaPixels) {
        console.log(fCroppedAreaPixels)
        setCroppedAreaPixels(fCroppedAreaPixels);
    }

    function handleFileInputChange(e) {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];

            console.log(file)

            const url = URL.createObjectURL(file);
            setUploadedImage(url);
        }
    }

    function handleUploadCancelClick() {
        imageInputRef.current.value = null;
        setUploadedImage(null);
    }

    function handleUploadSaveClick() {
        const canvas = document.createElement('canvas');
        canvas.width = croppedAreaPixels.width;
        canvas.height = croppedAreaPixels.height;

        const ctx = canvas.getContext('2d');

        const img = new Image();
        img.onload = async () => {
            ctx.drawImage(img, croppedAreaPixels.x, croppedAreaPixels.y, croppedAreaPixels.width, croppedAreaPixels.height, 0, 0, croppedAreaPixels.width, croppedAreaPixels.height);

            canvas.toBlob(async (blob) => {
                const croppedImageURL = await resizeFile(blob);
                // const croppedImageURL = URL.createObjectURL(croppedImage);

                imageInputRef.current.value = null;
                setUploadedImage(null);

                handleConfirmClick('pfp', croppedImageURL);

                console.log(croppedImageURL)

            }, 'image/jpg')

        }
        img.src = uploadedImage;
    }



    return (
        <div className={`${uploadedImage ? 'absolute w-[50%] h-48' : ''}`}>
            <div className="relative">
                {
                    uploadedImage ? '' : <img src={image} width={100} height={100} alt='Avatar' className="rounded-full" onClick={() => imageInputRef.current.click()} />
                }

                <input ref={imageInputRef} onChange={handleFileInputChange} type="file" accept="image/*" className="hidden" />
                {
                    uploadedImage ? <div className="h-96 bg-black w-full">
                        <ImageCropper image={uploadedImage} onCropComplete={handleCropComplete} />
                    </div>
                        : ''
                }
            </div>

            {uploadedImage && (
                <div className="flex mb-4">
                    <Button text={'Cancel'} isCancel={true} onButtonClick={handleUploadCancelClick} />
                    <Button text={'Save'} onButtonClick={handleUploadSaveClick} />
                </div>
            )}
        </div>
    )
}