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
    addOrEdit: (formData: any, onSuccess: any) => void,
    onDelete: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: number) => void,
    hideModal?: () => void,
    recordForEdit: null
}
const ViewEditDialog = ({ addOrEdit, recordForEdit,onDelete}:ImagesListProps) => {
    const [open, setOpen] = useState(false);
    const showModal = () => {
        setOpen(true);
    };

    const hideModal = () => {
        setOpen(false);
    };
    const [values, setValues] = useState<UploadableFile>(initialFieldValues);
    useEffect(() => {
        if (recordForEdit != null)
            setValues(recordForEdit);
    }, [recordForEdit])

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
            console.log(imageFile);
            const reader = new FileReader();
            reader.onload = x => {
                setValues({
                    ...values,
                    imageFile,
                    imageSrc: x.target!.result as string
                })
            }
            reader.readAsDataURL(imageFile)
        }
        else {
            setValues({
                ...values,
                imageFile: undefined,
                imageSrc: defaultImageSrc
            })
        }
    }

    const resetForm = () => {
        (document.getElementById('image-uploader1') as HTMLInputElement).value = '';
        setValues(initialFieldValues)
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
                View
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
                        <input type="file" accept="image/*" className={"form-control-file"}
                            onChange={showPreview} id="image-uploader1" />
                    </div>
                    <div className="form-group">
                        <input className={"form-control"} placeholder="Employee Name" name="employeeName"
                            value={values.employeeName}
                            onChange={handleInputChange} />
                    </div>
                    <div className="form-group">
                        <input className="form-control" placeholder="Occupation" name="occupation"
                            value={values.occupation}
                            onChange={handleInputChange} />
                    </div>
                    <div className="form-group text-center">
                        <button type="submit" className="btn btn-light">Submit</button>
                    </div>
                </div>
            </div>
            <button
          className="btn btn-light delete-button"
          onClick={(e) => onDelete(e, values.employeeID)}
        >
          <i className="far fa-trash-alt"></i>
        </button>
        </form>
            </Modal>
        </div>
    </>
  )
}

export default ViewEditDialog