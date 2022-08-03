import stringToColor from "./stringToColor";
function stringAvatar(name, width = 60, height = 60) {
    return {
        sx: {
            bgcolor: stringToColor(name),
            marginRight: "5px",
            color: "white",
            height,
            width,
        },
        children: `${name.split(" ")[0][0]}`,
    };
}

export default stringAvatar;
