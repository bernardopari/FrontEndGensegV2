export type User = {
    id: Number,
    usuario:  string,
    password: string
}

export type Usuario = {
    iduser: Number,
    estado: boolean,
    idrol: Number,
    idsubunidad: Number,
    iddatauser: Number,
    roles: Rol[],
    subunidad: SubUnidad[]
}

export type Rol = {
    id_rol: Number,
    n_rol: string,
    abrev: string
}
export type SubUnidad = {
    id_rol: Number,
    n_rol: string,
    abrev: string
}