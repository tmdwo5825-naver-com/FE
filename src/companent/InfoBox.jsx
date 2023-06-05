import classes from "./InfoBox.module.css";


function InfoBox(){


    return (
        <form className={classes.form} >
            <h1 className={classes.main}>Info</h1>
            <h1 className={classes.title}>📌업로드</h1>
            <h1 className={classes.text}>고양이가 출몰한 위치에 파란색 화살표를 놓아주세요.</h1>
                <h1 className={classes.text}>하단 가운데의 버튼을 눌러 사진과 코멘트를 업로드 할 수 있어요.</h1>
            <h1 className={classes.title}>📌고양이 마커</h1>
            <h1 className={classes.text}>지도의 고양이 마커를 클릭하면 고양이 사진과 코멘트 , 업로드 시간을 확인할 수 있어요.</h1>
            <h1 className={classes.title}>📌24시간 메뉴</h1>
            <h1 className={classes.text}>하루동안 업로드된 고양이를 모두 모아 볼 수 있어요.</h1>
            <h1 className={classes.text}>하루동안 어디서 가장 많은 고양이가 출몰했는지를 확인해보세요! </h1>
            <h1 className={classes.title}>📌3시간 메뉴</h1>
            <h1 className={classes.text}>최근 3시간동안 출몰한 고양이를 확인해보세요.</h1>
            <h1 className={classes.text}>고양이 캣타워(다수출몰지역)에 접근 한 고양이 수도 확인 할 수 있어요!</h1>

            <br />
            <br />
            <h1 className={classes.copyright}>ⓒ mr. cat mom</h1>

        </form>
    );
};

export default InfoBox;