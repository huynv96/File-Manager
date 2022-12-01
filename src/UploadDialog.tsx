import React,{ useState, useEffect,ChangeEvent } from 'react'
import { Button, Modal } from 'antd';

const defaultImageSrc = '/img/image_placeholder.png'

const initialFieldValues = {
    employeeID: 0,
    employeeName: '',
    occupation: '',
    imageName: '',
    imageSrc: defaultImageSrc
}
interface UploadableFile {
    employeeID: number,
    employeeName: string,
    occupation: string,
    imageName: string,
    imageSrc: string,
    imageFile?: File
}
interface ImagesListProps{
    addOrEdit: (formData: any, onSuccess: any) => void
}
const UploadDialog = ({ addOrEdit }:ImagesListProps) => {
    const uploadRef = React.useRef<HTMLInputElement>(null);
    const statusRef = React.useRef<HTMLParagraphElement>(null);
    const loadTotalRef = React.useRef<HTMLParagraphElement>(null);
    const progressRef = React.useRef<HTMLProgressElement>(null);
    const [open, setOpen] = useState(false);
    const showModal = () => {       
        setOpen(true);  
        // if((document.getElementById('image-uploader2') as HTMLInputElement).value !== ''){
        //     resetForm();
        // }           
    };

    const hideModal = () => {
        setOpen(false);
    };
    const [values, setValues] = useState<UploadableFile>(initialFieldValues);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setValues({
            ...values,
            [name]: value
        })
    }

    const showPreview = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            
            let imageFile = e.target.files[0];
            console.log(imageFile.size);
            console.log(imageFile.type);
            console.log(imageFile.name);
            const reader = new FileReader();
            reader.onload = x => {
                setValues({
                    ...values,
                    imageFile,
                    imageSrc: x.target!.result as string
                })
            }
            reader.readAsDataURL(imageFile);
        }
        else {
            setValues({
                ...values,
                imageFile: undefined,
                imageSrc: defaultImageSrc
            })
        }
    }
    const ProgressHandler = (e:ProgressEvent) => {
        console.log(`uploaded ${e.loaded} bytes of ${e.total}`)
        // loadTotalRef.current!.innerHTML = `uploaded ${e.loaded} bytes of ${e.total}`;
        var percent = (e.loaded / e.total) * 100;
        console.log(Math.round(percent));
        //progressRef.current.value! = Math.round(percent);
        //statusRef.current.innerHTML = Math.round(percent) + "% uploaded...";
        console.log(Math.round(percent) + "% uploaded...");
      };
    
      const SuccessHandler = (e:ProgressEvent) => {
        // statusRef.current.innerHTML = e.target?.responseText;
        // progressRef.current.value = 0;
        console.log('Loaded')
      };
      const ErrorHandler = () => {
        // statusRef.current.innerHTML = "upload failed!!";
        console.log("upload failed!!")
      };
      const AbortHandler = () => {
        //statusRef.current.innerHTML = "upload aborted!!";
        console.log("upload aborted!!")
      };
    const resetForm = () => {        
        setValues(initialFieldValues);
        (document.getElementById('image-uploader2') as HTMLInputElement).value = '';
    }

    const handleFormSubmit = (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if(values.employeeName !== "" && values.imageSrc !== defaultImageSrc){
            const formData = new FormData()
                formData.append('employeeID', values.employeeID.toString())
                formData.append('employeeName', values.employeeName)
                formData.append('occupation', values.occupation)
                formData.append('imageName', values.imageName)
                formData.append('imageFile', values.imageFile!)
                addOrEdit(formData, resetForm)
                hideModal();
                
        }
    }



  return (    
    <>
    <div className='view-edit-modal'>
            <Button type="primary" onClick={showModal}>
                Upload
            </Button>
            <Modal
                title="Modal"
                open={open}
                onOk={hideModal}
                onCancel={hideModal}
                okText="Save"
                cancelText="Cancel"
                footer={null}
            >
            <div className="container text-center">
            <p className="lead">Quản lý ảnh</p>
        </div>
        <form autoComplete="off" noValidate onSubmit={handleFormSubmit}>
            <div className="card">
                <img src={values.imageSrc} className="card-img-top" alt='img' />
                <div className="card-body">
                    <div className="form-group">
                        <input type="file" className={"form-control-file"}
                            onChange={showPreview} 
                            id="image-uploader2"
                            ref={uploadRef}
                        />
                    </div>
                    <div className="form-group">
                        <input className={"form-control"} placeholder="Employee Name" name="employeeName"
                            value={values.employeeName}
                            onChange={handleInputChange} 
                        />
                    </div>
                    <div className="form-group">
                        <input className="form-control" placeholder="Occupation" name="occupation"
                            value={values.occupation}
                            onChange={handleInputChange} 
                            />
                    </div>
                    <div className="form-group text-center">
                        <button type="submit" className="btn btn-light">Submit</button>
                    </div>
                </div>
            </div>
            
            <label>
                File progress: <progress ref={progressRef} value="0" max="100" />
            </label>
            <p ref={statusRef}></p>
            <p ref={loadTotalRef}></p>
        </form>
            </Modal>
        </div>
    </>
  )
}

export default UploadDialog