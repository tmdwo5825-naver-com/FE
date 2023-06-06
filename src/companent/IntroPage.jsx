import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import classes from "./IntroPage.module.css";

const IntroPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // 사용자가 사이트에 처음 방문했는지 확인
        const isFirstVisit = localStorage.getItem('isFirstVisit');

         //사용자가 이전에 방문한 적이 있는 경우 메인 페이지로 바로 이동
        //만약 처음방문시에만 인트로 페이지 가려면 아래 주석을 해제
        /*
        if (isFirstVisit === 'false') {
            navigate('/3hours');
            return;
        }

         */

        const timer = setTimeout(() => {
            // navigate 함수를 사용하여 페이지 이동
            navigate('/3hours');
            localStorage.setItem('isFirstVisit', 'false');
        }, 3000); // 4초 후 메인 페이지로 이동

        return () => clearTimeout(timer); // 컴포넌트가 unmount되면 타이머를 정리
    }, [navigate]);

    const textDivStyle = {
        top: "30%",
        left: "30%",
        position : "fixed",
        transform: 'translate(-50%, -50%)',
    };

    return ( //디자인은 후에 바꿀것
        <div
            style={{
                overflow: 'hidden',
            }}
        >
            <div className={classes.background}> </div>
            <div >
                <p className={classes.text1}>Chuung</p>
                <p className={classes.text2}>Nyann</p>
            </div>

        </div>
    );
};

export default IntroPage;