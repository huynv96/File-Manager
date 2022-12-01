import React, { useState, useEffect } from "react";
import UploadDialog from "./UploadDialog";
import ViewEditDialog from "./ViewEditDialog";
import axios from "axios";
import { Col, Row,Input } from 'antd';
import LazyLoad from 'react-lazyload';
// npm i --save-dev @types/react-lazyload --force
interface RequestAPI{
    id: number,
    fileName: string,
    imageName: string,
    fileType?: string,
    resolution: string,
    tags: string,
    size: string,
    url: string,
    imageFile: any | null
}
interface ResponseAPI{
  id: number,
  fileName: string,
  imageName: string,
  fileType: string,
  resolution: string,
  url: string,
  tags: string,
  size: string,
  imageFile: any | null
}
export default function MediaList() {
  const [mediaList, setMediaList] = useState([]);
  const [recordForEdit, setRecordForEdit] = useState<any | null>(null);

  useEffect(() => {
    refreshMediaList();
  }, []);

  const mediaAPI = (url = "https://localhost:7081/api/FileManager/") => {
    return {
      fetchAll: () => axios.get(url),
      create: (newRecord:FormData) => axios.post(url, newRecord),
      update: (id:number, updatedRecord:FormData) => axios.put(url + id, updatedRecord),
      delete: (id:number) => axios.delete(url + id),
    };
  };

  function refreshMediaList() {
    mediaAPI()
      .fetchAll()
      .then((res) => {
        setMediaList(res.data);
        console.log(res.data);
      })
      .catch((err) => console.log(err));
  }
  const EditData = (formData: FormData, onSuccess: () => void) =>{
    mediaAPI()
    .update(Number(formData.get("MediaID")), formData)
    .then((res) => {
      onSuccess();
      refreshMediaList();
    })
    .catch((err) => console.log(err));
  }
  const AddData = (formData: FormData, onSuccess: () => void) =>{
    mediaAPI()
    .create(formData)
    .then((res) => {
      onSuccess();
      refreshMediaList();
    })
    .catch((err) => console.log(err));
  }
  const addOrEdit = (formData: FormData, onSuccess: () => void) => {
    if (formData.get("MediaID") == "0")
      mediaAPI()
        .create(formData)
        .then((res) => {
          onSuccess();
          refreshMediaList();
        })
        .catch((err) => console.log(err));
    else
      mediaAPI()
        .update(Number(formData.get("MediaID")), formData)
        .then((res) => {
          onSuccess();
          refreshMediaList();
        })
        .catch((err) => console.log(err));
        
  };

  const showRecordDetails = (data:RequestAPI) => {
    setRecordForEdit(data);
  };

  const onDelete = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    id: number
  ) => {
    e.stopPropagation();
    if (window.confirm("Are you sure to delete this record?"))
      mediaAPI()
        .delete(id)
        .then((res) => refreshMediaList())
        .catch((err) => console.log(err));
  };

  const imageCard = (data:RequestAPI) => (
    <div className="card">     
      <LazyLoad>
          <img src={data.url} className="card-img-top rounded-circle" alt="img" />
      </LazyLoad>
      <div className="card-body">
        <h5>{data.fileName}</h5>
        <span>{data.tags}</span> <br />
        <span>{data.size}</span> <br />
        <button
          className="btn btn-light delete-button"
          onClick={(e) => onDelete(e, data.id)}
        >
          <i className="far fa-trash-alt"></i>
        </button>
        <div className="btn" 
        onClick={() => {
            showRecordDetails(data);
          }}
          style={{padding:0}}
        >
            <ViewEditDialog
                addOrEdit={addOrEdit}
                recordForEdit={recordForEdit}
                onDelete={onDelete}
            />
        </div>
      </div>
    </div>
  );
return (
    <>   
        <UploadDialog
        addOrEdit={addOrEdit}
        />      
        <div className="row">
            <div className="col-md-12">
                <div className="jumbotron jumbotron-fluid py-4">
                <div className="container text-center">
                    <h1 className="display-4">Quản lý ảnh</h1>
                </div>
                </div>
            </div>
            <Row gutter={[16, 16]} >
              <div>Hello</div>
                    {
                      [...Array(mediaList.length)].map((e, i) => (
                          <Col span={4} key={i} xs={16} sm={16} md={8} lg={8} xl={4} >
                              <LazyLoad
                              key={i}
                              >
                                  {mediaList[i]
                                  ? imageCard(mediaList[i])
                                  : null}
                              </LazyLoad>
                          </Col>                                              
                      ))
                    }
            </Row> 
        </div>
    </>
  );
}
