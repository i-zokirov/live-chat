const getTime = (DateObj) => {
    const date = new Date(DateObj);
    const hour = date.getHours();
    const minutes = date.getMinutes();

    return `${hour}:${minutes < 10 ? `0${minutes}` : minutes}`;
};

export default getTime;
