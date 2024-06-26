"use server";
import { createSupabaseClientBasedOnRole, createSupbaseAdmin } from "@/utils/supabase/server";
import { CreateFormSchema } from "../components/create/CreateForm";
import { readUserSession } from "@/utils/actions";
import { Member, Permission } from "@/type/permission";
import { PostgrestSingleResponse, UserAttributes, UserResponse } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";

export const createMember = async (data: CreateFormSchema) => {
	const { data: userSession } = await readUserSession()
	if (userSession.session?.user.role !== 'admin') {
		throw new Error('you are not allowed to create User')
	}

	const supabase = await createSupbaseAdmin()
	const { email, password, role, status, name } = data

	const createResult = await supabase.auth.admin.createUser({
		email,
		password,
		email_confirm: true,
		user_metadata: {
			role,
			status
		}
	})
	if (createResult.error) {
		throw createResult.error
	}

	const { data: memberResult, error: memberResultError } = await supabase.from("members").insert({
		id: createResult.data.user.id,
		name,
		email
	}).select()
	if (memberResultError) {
		throw memberResultError
	}
	const { data: permissionResult, error: permissionResultError } = await supabase.from("permission").insert({
		member_id: createResult.data.user.id,
		role,
		status
	}).select()

	if (permissionResultError) {
		throw permissionResultError
	}

	revalidatePath('/dashboard/members')
	return permissionResult

}

export const updateMemberById = async (id: string, data: Partial<Member>) => {
	const supabase = await createSupabaseClientBasedOnRole()
	const { error } = await supabase
		.from('members')
		.update(data)
		.eq('id', id)
	console.log(error)
	if (error) {
		throw error
	}
	revalidatePath('/dashboard/members')
}

export const updateUserById = async (id: string, data: Partial<UserAttributes>) => {
	const { data: userSession } = await readUserSession()
	if (userSession.session?.user.role !== 'admin') {
		throw new Error('you are not allowed to update User')
	}
	const supabase = await createSupabaseClientBasedOnRole()
	const { error } = await supabase.auth.admin.updateUserById(id, data)
	if (error) {
		throw error
	}
}

export const deleteMemberById = async (uid: string) => {

	const { data: userSession } = await readUserSession()
	if (userSession.session?.user.role !== 'admin') {
		throw new Error('you are not allowed to delete User')
	}
	const supabase = await createSupbaseAdmin()

	const deleteResult = await supabase.auth.admin.deleteUser(uid)
	if (deleteResult.error) {
		throw deleteResult.error
	}
	const { data, error: memberResultError } = await supabase.from('members').delete().eq("id", uid)
	if (memberResultError) {
		throw memberResultError
	}
	revalidatePath('/dashboard/members')
}

type ReadMembersSearchParams = { name: string }
export const readMembers = async ({ name }: Partial<ReadMembersSearchParams>) => {
	const supbase = await createSupabaseClientBasedOnRole()
	if (name) {
		return supbase
			.from('permission')
			.select('*, members!inner(*)')
			.eq('members.name', name)
			.order("created_at", { ascending: false })
	}
	return supbase
		.from('permission')
		.select('*, members!inner(*)')
		.order("created_at", { ascending: true, referencedTable: 'members' })
}
